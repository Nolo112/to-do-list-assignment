$(document).ready(function () {
  var tasks = [];

  var getAndDisplayAllTasks = function () {
    $.ajax({
      type: 'GET',
      url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=1315',
      dataType: 'json',
      success: function (response, textStatus) {
        tasks = response.tasks;
        displayTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  };

  var displayTasks = function () {
    // Clear the task list
    $('#todo-list').empty();

    // Get filter and sorting values
    var filter = $('#filter-tasks').val();
    var sort = $('#sort-tasks').val();

    // Filter tasks
    var filteredTasks = tasks.filter(function (task) {
      if (filter === 'completed') {
        return task.completed;
      } else if (filter === 'active') {
        return !task.completed;
      }
      return true; // 'all' case
    });

    // Sort tasks by ID or created_at
    if (sort === 'id') {
      filteredTasks.sort(function (a, b) {
        return a.id - b.id;
      });
    } else if (sort === 'created_at') {
      filteredTasks.sort(function (a, b) {
        return new Date(a.created_at) - new Date(b.created_at);
      });
    }

    // Append each task to the list
    filteredTasks.forEach(function (task) {
      $('#todo-list').append(
        '<div class="row">' +
        '<p class="col-xs-8">' + task.content + '</p>' +
        '<button class="delete btn btn-danger" data-id="' + task.id + '">Delete</button>' +
        '<input type="checkbox" class="mark-complete" data-id="' + task.id + '"' + (task.completed ? ' checked' : '') + '>' +
        '</div>'
      );
    });
  };

  var createTask = function () {
    $.ajax({
      type: 'POST',
      url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=1315',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        task: {
          content: $('#new-task-content').val()
        }
      }),
      success: function (response, textStatus) {
        $('#new-task-content').val(''); // Clear input
        getAndDisplayAllTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  };

  $('#create-task').on('submit', function (e) {
    e.preventDefault();
    createTask();
  });

  var deleteTask = function (id) {
    $.ajax({
      type: 'DELETE',
      url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '?api_key=1315',
      success: function (response, textStatus) {
        getAndDisplayAllTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  };

  $(document).on('click', '.delete', function () {
    deleteTask($(this).data('id'));
  });

  var markTaskComplete = function (id) {
    $.ajax({
      type: 'PUT',
      url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '/mark_complete?api_key=1315',
      dataType: 'json',
      success: function (response, textStatus) {
        getAndDisplayAllTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  };

  var markTaskActive = function (id) {
    $.ajax({
      type: 'PUT',
      url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '/mark_active?api_key=1315',
      dataType: 'json',
      success: function (response, textStatus) {
        getAndDisplayAllTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  };

  $(document).on('change', '.mark-complete', function () {
    if (this.checked) {
      markTaskComplete($(this).data('id'));
    } else {
      markTaskActive($(this).data('id'));
    }
  });

  // Handle filter change
  $('#filter-tasks').on('change', function () {
    displayTasks();
  });

  // Handle sort change
  $('#sort-tasks').on('change', function () {
    displayTasks();
  });

  getAndDisplayAllTasks();
});

