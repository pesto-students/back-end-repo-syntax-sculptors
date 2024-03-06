const httpStatus = require('http-status');
const CreateHttpError = require('http-errors');
const Task = require('../models/task.model');

// Controller method to add a new task
exports.addTask = async (req, res, next) => {
  try {
    const userId = req.user;
    const {
      title,
      locationType,
      description,
      location,
      dateType,
      date,
      budget,
      imageURLs,
    } = req.body;
    const taskData = {
      title,
      description,
      status: 'open',
      budget,
      createdOn: new Date(),
      lastEdited: null,
      dateType,
      date,
      locationType,
      location,
      imageURLs,
      postedBy: userId,
      comments: [],
      assignedUser: null,
    };
    const newTask = await Task.create(taskData);
    res.status(httpStatus.CREATED).json(newTask);
  } catch (error) {
    next(error);
  }
};

// Controller method to get all tasks by a user
exports.getAllTasksByUser = async (req, res, next) => {
  try {
    const userId = req.user;
    // eslint-disable-next-line prefer-const
    let { status, title } = req.query;

    const query = { postedBy: userId };

    // Set default status filter if status query parameter is not provided
    if (!status) {
      status = ['open', 'assigned'];
    } else {
      // If status is provided, convert it to an array if it's a string
      status = Array.isArray(status) ? status : [status];
    }

    // Include status filter in the query
    query.status = { $in: status };

    if (title) {
      query.title = { $regex: new RegExp(title, 'i') };
    }

    const tasks = await Task.find(query);

    // Set status to 200 OK and send the tasks as a response
    res.status(httpStatus.OK).json(tasks);
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const userId = req.user; // Assuming you're extracting user ID from JWT token
    const { taskId } = req.params;

    // Find the task by ID
    const task = await Task.findById(taskId);

    // If the task doesn't exist, throw a 404 error
    if (!task) {
      throw new CreateHttpError.NotFound('Task not found');
    }

    // Check if the user is the owner of the task
    if (task.postedBy !== userId) {
      throw new CreateHttpError.Forbidden(
        'You are not authorized to delete this task',
      );
    }
    // Check if the task is already cancelled
    if (task.status === 'cancelled') {
      throw new CreateHttpError.BadRequest('Task is already cancelled');
    }
    // Update the task status to "cancelled"
    task.status = 'cancelled';
    await task.save();

    // If the task was successfully deleted, send a success response
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error); // Pass any caught errors to the error handling middleware
  }
};
