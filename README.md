# Psuedocode Expander


https://github.com/user-attachments/assets/c598e671-72fa-4929-b530-a830c8795353


Build full stack applications from psuedocode. Iterate on your natural language psuedocode with AI to take the psuedocode one level at a time towards a real application. Here are some examples:


<details>
<summary>Todo list app example</summary>

## Step 0 (saved to todo.txt)
```
Fullstack TODO list app with express backend and Vue.js frontend
```


```bash
pex todo.txt
```

## Step 1:
```
Backend (Express.js)
  API Endpoints for managing tasks
  Handles business logic for task operations
  Connects to the database

Frontend (Vue.js)
  User interface for displaying and interacting with tasks
  Sends requests to the backend API
  Manages UI state

Database
  Stores task data
```

```bash
pex todo.txt
```

## Eventually (step 6, see recording)
```
Backend (Express.js)
  Server setup and configuration
    Initialize Express application
    Set port number for the server
    Use `express.json()` middleware to parse JSON request bodies
    Use `express.urlencoded()` middleware to parse URL-encoded request bodies
    Set up basic error handling middleware to catch unhandled errors

  API Endpoints (Routes)
    Set up a main router for API routes
    Task Routes
      GET all tasks
        Associate path `/tasks` with a controller function
        Expected response: 200 OK with an array of task objects
        Error response: 500 Internal Server Error if database operation fails
      GET a single task by ID
        Associate path `/tasks/:id` with a controller function
        Expected response: 200 OK with the task object or 404 Not Found if task not found
        Error response: 400 Bad Request for invalid ID, 500 Internal Server Error
      POST a new task
        Associate path `/tasks` with a controller function
        Expected response: 201 Created with the new task object
        Error response: 400 Bad Request for invalid input, 500 Internal Server Error
      PUT (update) an existing task by ID
        Associate path `/tasks/:id` with a controller function
        Expected response: 200 OK with the updated task object or 404 Not Found
        Error response: 400 Bad Request for invalid input, 500 Internal Server Error
      PATCH update a task's completion status by ID
        Associate path `/tasks/:id/toggle-completion` with a controller function
        Expected response: 200 OK with the updated task object or 404 Not Found
        Error response: 400 Bad Request for invalid input, 500 Internal Server Error
      DELETE a task by ID
        Associate path `/tasks/:id` with a controller function
        Expected response: 204 No Content or 200 OK if task was found and deleted, 404 Not Found if task not found
        Error response: 500 Internal Server Error
      DELETE all completed tasks
        Associate path `/tasks/completed` with a controller function
        Expected response: 204 No Content or 200 OK with count of deleted tasks
        Error response: 500 Internal Server Error

  Controllers (Business Logic for Task Operations)
    Function fetch all tasks from database (async)
      Accepts request and response objects
      Query the Task model for all tasks, potentially with a filter
      Send JSON response with tasks and appropriate status code
      Handle and send error response if query fails
    Function fetch a single task from database (async)
      Accepts request and response objects
      Extract task ID from request parameters
      Query the Task model by ID
      Send JSON response with task or 404 if not found
      Handle and send error response
    Function create a new task in database (async)
      Accepts request and response objects
      Extract task description from request body
      Validate input
      Create a new Task model instance
      Save the new task to the database
      Send JSON response with the created task and 201 status
      Handle and send error response
    Function update an existing task in database (async)
      Accepts request and response objects
      Extract task ID from parameters and update fields from body
      Validate input
      Find and update the Task model by ID
      Send JSON response with updated task or 404 if not found
      Handle and send error response
    Function delete a task from database (async)
      Accepts request and response objects
      Extract task ID from parameters
      Find and delete the Task model by ID
      Send success response (e.g., 204 No Content) or 404 if not found
      Handle and send error response
    Function to delete all completed tasks from database (async)
      Accepts request and response objects
      Delete tasks from the Task model where status is completed
      Send success response (e.g., 204 No Content or count)
      Handle and send error response

  Database Connection
    Import Mongoose library
    Define database URI (e.g., from environment variables)
    Function to establish connection to MongoDB using Mongoose
      Attempt to connect to the database URI with specified options
      Log success message upon successful connection
      Log error message if connection fails
      Set up event listeners for connection errors

Frontend (Vue.js)
  Main Application Instance
    Create the Vue application instance
    Mount the main application component (`App.vue`) to an HTML element with id "app"
        Use the `mount` method of the created Vue application instance
        Pass the CSS selector for the HTML element with id "app" to the `mount` method

  Core Components
    App.vue (main layout and orchestration)
      Template:
        Container for the application layout
          Heading: "My To-Do List"
          Section for `TaskInput` component
            Include `TaskInput` component
            Listen for `add-task` event from `TaskInput` and trigger state action
          Section for `TaskList` component
            Include `TaskList` component
            Pass `tasks` from state as a prop to `TaskList`
            Listen for `toggle-completion` event from `TaskList` and trigger state action
            Listen for `delete-task` event from `TaskList` and trigger state action
          Section for actions
            Button to "Clear Completed Tasks"
            Listen for click event to trigger state action
      Script:
        Import `TaskInput` component
        Import `TaskList` component
        Import `mapState` helper from state management library
        Import `mapActions` helper from state management library
        Define component options:
          `components`: register `TaskInput` and `TaskList`
          `computed`: map `tasks` from state to a local computed property
          `methods`: map `fetchTasks`, `addTask`, `toggleTaskCompletion`, `deleteTask`, `clearCompletedTasks` actions
          `onMounted` lifecycle hook:
            Call the `fetchTasks` action to load tasks when the component is mounted
    TaskInput.vue (component for adding new tasks)
      Template:
        Form element for new task input
          Input field for task description
            Bind input value to `newTaskDescription` data property using `v-model`
            Add placeholder text
          Button to add task
            Bind click event or form submit event to `addTask` method
            Display "Add Task" text
      Script:
        Data property: `newTaskDescription` (string, initialized as empty)
        Method: `addTask`
          Prevent default form submission behavior
          If `newTaskDescription` is not empty:
            Emit a custom event named "add-task" with the value of `newTaskDescription` as payload
            Clear the `newTaskDescription` input field by setting it to empty string
          Else:
            Optionally display a user message about empty input
    TaskList.vue (component for displaying tasks)
      Template:
        Unordered list element to contain task items
          Loop over the `tasks` prop using `v-for` directive
            Bind a unique `key` for each `TaskItem` using task ID
            Render `TaskItem` component for each task
            Pass the current task object as a `task` prop to `TaskItem`
            Listen for `toggle-completion` event emitted by `TaskItem`
              Call `handleToggleCompletion` method with the emitted task ID
            Listen for `delete-task` event emitted by `TaskItem`
              Call `handleDeleteTask` method with the emitted task ID
      Script:
        Import `TaskItem` component
        Props:
          `tasks`: an array of task objects, required
        Methods:
          `handleToggleCompletion(taskId)`:
            Emit a custom event named "toggle-completion" with the `taskId` as payload
          `handleDeleteTask(taskId)`:
            Emit a custom event named "delete-task" with the `taskId` as payload
    TaskItem.vue (component for a single task within the list)
      Template:
        List item element for a single task
          Apply dynamic CSS class `isCompletedClass` based on task completion status
          Checkbox or button to mark as complete/incomplete
            Bind its checked state to `task.isCompleted`
            Listen for change event to trigger `toggleTaskCompletion` method
          Display task description
            Use a `<span>` or similar element to display `task.description`
          Button to delete task
            Listen for click event to trigger `deleteTask` method
            Display "Delete" text
      Script:
        Props:
          `task`: an object containing `id`, `description`, and `isCompleted` properties, required
        Computed property:
          `isCompletedClass`:
            Return "completed-task" string if `task.isCompleted` is true, otherwise return an empty string
        Methods:
          `toggleTaskCompletion`:
            Emit a custom event named "toggle-completion" with `task.id` as payload
          `deleteTask`:
            Emit a custom event named "delete-task" with `task.id` as payload

  State Management (e.g., Vuex or Pinia)
    Define a store for tasks
      State:
        `tasks`: an empty array (initial state)
      Mutations:
        `SET_TASKS(state, tasks)`: Replaces the current tasks array with the provided tasks
        `ADD_TASK(state, task)`: Adds a new task to the tasks array
        `UPDATE_TASK(state, updatedTask)`: Finds and updates an existing task in the array
        `REMOVE_TASK(state, taskId)`: Removes a task from the array by its ID
      Actions:
        `fetchTasks()`: Asynchronous action
          Call `apiService.getTasks()`
          Commit `SET_TASKS` mutation with the fetched tasks
          Handle API errors
        `addTask(description)`: Asynchronous action
          Call `apiService.createTask(description)`
          Commit `ADD_TASK` mutation with the newly created task
          Handle API errors
        `toggleTaskCompletion(taskId)`: Asynchronous action
          Find the task in the current state
          Call `apiService.updateTaskCompletion(taskId, newStatus)`
          Commit `UPDATE_TASK` mutation with the updated task
          Handle API errors
        `deleteTask(taskId)`: Asynchronous action
          Call `apiService.deleteTask(taskId)`
          Commit `REMOVE_TASK` mutation with the task ID
          Handle API errors
        `clearCompletedTasks()`: Asynchronous action
          Call `apiService.deleteCompletedTasks()`
          Commit `SET_TASKS` mutation by filtering out completed tasks from current state
          Handle API errors

  API Service/Module
    Import HTTP client library (e.g., Axios)
    Base URL configuration for API requests
    Function `getTasks()`:
      Make a GET request to `/api/tasks`
      Return response data or throw error
    Function `createTask(description)`:
      Make a POST request to `/api/tasks` with `{ description: description }`
      Return response data or throw error
    Function `updateTaskCompletion(taskId, isCompleted)`:
      Make a PATCH request to `/api/tasks/:id/toggle-completion` with `{ isCompleted: isCompleted }`
      Return response data or throw error
    Function `deleteTask(taskId)`:
      Make a DELETE request to `/api/tasks/:id`
      Return response data or throw error
    Function `deleteCompletedTasks()`:
      Make a DELETE request to `/api/tasks/completed`
      Return response data or throw error

Database (MongoDB)
  Collections
    Tasks collection
  Task Document Schema
    Define a Mongoose Schema for a Task
    Fields:
      `description`:
        Type: String
        Required: true
        Trim: true
      `isCompleted`:
        Type: Boolean
        Default: false
      `createdAt`:
        Type: Date
        Default: current timestamp upon creation
    Add timestamps option to schema for automatic `createdAt` and `updatedAt` fields
    Create a Mongoose Model from the schema
```

</details>




## Usage:
### Take the psuedocode one step forward (add more details, etc)
```bash
pex <filename>
```

### Give specific instructions for the next step:
```bash
pex <filename> "Develop a design style for the app and add more backend routes"
```

### Update a specific section of the psuedocode:
```bash
# Sections are found based on a line that starts with the section
# name, then everything underneath (indented further) is part of
# that section.
pex <filename> --section "Database" # Optioanlly add specific instructions
```

### Generate real code for the psuedocode
```bash
# For the entire psuedocode:
pex <filename> --mode "realcode"

# For a specific section:
pex <filename> --section "Backend" --mode "realcode"
```
