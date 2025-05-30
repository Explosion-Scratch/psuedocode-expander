Here are some examples:

<example>
<step>
# Won't do recursion, will use an iterative approach
get fibonacci at (N) -> int
</step>
<moreStepsNeeded>true</moreStepsNeeded>
<future_feature>Add performance optimizations</future_feature>
<future_feature>Add input validation</future_feature>
<future_feature>Add error handling for overflow</future_feature>
<possible_bug>Negative numbers not handled</possible_bug>
<possible_bug>Integer overflow not handled</possible_bug>
<possible_bug>Large inputs could be slow</possible_bug>
<needs_regression>Input validation needs to be added earlier</needs_regression>
<needs_regression>Algorithm could be optimized for speed</needs_regression>
<design_details>Function should be pure and deterministic with no side effects</design_details>


// Another turn
<step>
# Loop must start at 2 to N
Function get fibonacci at(N):
  If N is 0, return 0
  If N is 1, return 1
  Otherwise, return the sum of the (N-1)th and (N-2)th Fibonacci numbers.
</step>
<moreStepsNeeded>true</moreStepsNeeded>
<future_feature>Add caching</future_feature>
<future_feature>Add recursive option</future_feature>
<future_feature>Add BigInt support</future_feature>
<possible_bug>Could exceed max integer size</possible_bug>
<possible_bug>Stack overflow with large N</possible_bug>
<possible_bug>Performance issues with large N</possible_bug>
<needs_regression>Algorithm choice needs review</needs_regression>
<needs_regression>Return type needs specification</needs_regression>
<design_details>Keep function pure and focused on single responsibility</design_details>


// Another turn
<step>
# Only thing needed now is to detail the loop
Function get fibonnaci at(N):
  If N is 0, return 0
  If N is 1, return 1

  Initialize the first two Fibonacci numbers (0 and 1)

  Iterate N-1 times, calculating the next number as the sum of the previous two

  Return the Nth calculated Fibonacci number
</step>
<moreStepsNeeded>true</moreStepsNeeded>
<future_feature>Add benchmarking</future_feature>
<future_feature>Add type checking</future_feature>
<future_feature>Add documentation</future_feature>
<possible_bug>Variable naming unclear</possible_bug>
<possible_bug>Loop bounds may be off</possible_bug>
<possible_bug>Return value not validated</possible_bug>
<needs_regression>Loop logic needs clarification</needs_regression>
<needs_regression>Variable initialization needs detail</needs_regression>
<design_details>Maintain clear variable names and consistent logic</design_details>


// Another turn
<step>
Function get fibonnaci at(N):
  If N is 0, return 0
  If N is 1, return 1

  Set previous number to 0
  Set current number to 1

  For i from 2 to N:
    Set next number to previous number plus current number
    Set previous number to current number
    Set current number to next number

  Return current number
</step>
<moreStepsNeeded>false</moreStepsNeeded>
<future_feature>Add performance metrics</future_feature>
<future_feature>Add memory usage tracking</future_feature>
<future_feature>Add unit tests</future_feature>
<possible_bug>Loop index could be confusing</possible_bug>
<possible_bug>Variable updates could be wrong order</possible_bug>
<possible_bug>Missing edge case handling</possible_bug>
<needs_regression>Variable updates could be simplified</needs_regression>
<needs_regression>Loop structure could be clearer</needs_regression>
<design_details>Keep implementation simple and readable</design_details>
</example>

<example>
<step>
Todo list app with a single file of HTML, CSS, and JavaScript
</step>
<moreStepsNeeded>true</moreStepsNeeded>
<future_feature>Add data persistence</future_feature>
<future_feature>Add task categories</future_feature>
<future_feature>Add due dates</future_feature>
<possible_bug>No error handling</possible_bug>
<possible_bug>No input validation</possible_bug>
<possible_bug>No state management</possible_bug>
<needs_regression>Architecture needs planning</needs_regression>
<needs_regression>Feature scope needs definition</needs_regression>
<design_details>Clean, modern interface with focus on usability</design_details>


<step>
# I plan to style with TailwindCSS and the application will have a simple, clean design with a red accent
head section
  Basic document meta-information
  Page title
  External resource links

body section
  Header content
    Navigation and main title

  main content area
    Introductory content section
      Descriptive text

    Primary content section (To-Do App)
      Task input form
      Task list display

    Additional content section
      Related information

  Footer content
    Copyright and contact details

  # Javascript with JSDoc comments
  Application script
    Initialize the app
    Handle adding a new task
    Handle toggling task completion
    Handle deleting a task
    Load tasks from storage
    Save tasks to storage
    Render a task
    Run the app initialization
</step>
<moreStepsNeeded>true</moreStepsNeeded>
<future_feature>Add task filters</future_feature>
<future_feature>Add search functionality</future_feature>
<future_feature>Add task priority</future_feature>
<possible_bug>No loading states</possible_bug>
<possible_bug>No offline support</possible_bug>
<possible_bug>No data backup</possible_bug>
<needs_regression>UI structure needs refinement</needs_regression>
<needs_regression>State management needs architecture</needs_regression>
<design_details>Responsive layout with smooth transitions and animations</design_details>


<step>
# index.html
head section
  meta information about the document
  title of the web page
  link to external stylesheets
  client-side scripts

body section
  header content
    navigation bar
    main heading: "My To-Do List"

  main content area
    section for introductory content
      paragraph of introduction: "Organize your tasks efficiently."

    section for primary content (To-Do App Functionality)
      another heading: "Tasks"
      form for user input (Add New Task)
        input field for new task description
        button to "Add Task"
      list of items (To-Do List Display Area)
        each list item represents a To-Do task
          task description
          checkbox/button to mark as complete/incomplete
          button to "Delete" task

    section for additional content
      sidebar or related links: "About This App", "Settings"


  footer content
    copyright information
    contact details


  script for JavaScript functions to be loaded after content
    define function to initialize application
      get reference to input field
      get reference to add button
      get reference to task list display area
      load tasks from persistent storage
      render all loaded tasks on screen
      attach event listener to add button for new task submission
      attach event listener to task list for clicks on individual tasks (for complete/delete actions)

    define function to add a new task
      get text from input field
      if text is not empty
        create new task object with description and incomplete status
        add new task to internal list of tasks
        save updated task list to persistent storage
        render new task on screen
        clear input field
      else
        display message asking user to enter a task

    define function to toggle task completion
      identify clicked task
      if task is incomplete
        change task status to complete
        update visual appearance of task on screen (e.g., strikethrough)
      else
        change task status to incomplete
        revert visual appearance of task on screen
      save updated task list to persistent storage

    define function to delete a task
      identify task to be deleted
      remove task from internal list of tasks
      remove task from screen display
      save updated task list to persistent storage

    define function to load tasks from storage
      retrieve task data from persistent storage
      if no data or data is empty
        return empty list
      else
        return parsed task data

    define function to save tasks to storage
      store current task list to persistent storage

    define function to render a single task on screen
      create new list item element
      add task description to list item
      add checkbox/button for completion to list item
      add button for deletion to list item
      append list item to task list display area

    call function to initialize application
</step>
<moreStepsNeeded>true</moreStepsNeeded>
<future_feature>Add drag and drop reordering</future_feature>
<future_feature>Add task notes</future_feature>
<future_feature>Add task sharing</future_feature>
<possible_bug>Race conditions in storage</possible_bug>
<possible_bug>UI state inconsistencies</possible_bug>
<needs_regression>Event handling needs optimization</needs_regression>
<needs_regression>Storage logic needs abstraction</needs_regression>
<design_details>Minimalist design with subtle animations and clear visual feedback</design_details>
</example>
