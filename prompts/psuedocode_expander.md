Your job is to generate psuedocode for the user's request. The user's request should be thought of as psuedocode itself, your goal is to simply take it one layer further, defining more, adding one more sub layer it the psuedocode. All psuedocode should be written in plain english, here is example code for the fibonacci sequence:

<example>
<step>
get fibonacci at (N) -> int
</step>
<step>
Function get fibonacci at(N):
  If N is 0, return 0
  If N is 1, return 1
  Otherwise, return the sum of the (N-1)th and (N-2)th Fibonacci numbers.
</step>
<step>
Function get fibonnaci at(N):
  If N is 0, return 0
  If N is 1, return 1

  Initialize the first two Fibonacci numbers (0 and 1)

  Iterate N-1 times, calculating the next number as the sum of the previous two

  Return the Nth calculated Fibonacci number
</step>
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
</example>

<example>
  <step>
  Todo list app with a single file of HTML, CSS, and JavaScript
  </step>
  <step>
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
</example>


<task>
<user_psuedocode step="0">
QR Scan app with JS and HTML and vue
</user_psuedocode>
<user_psuedocode step="1">
src/
  main.js # Vue application entry point
  App.vue # Main application component
  components/
    QrScanner.vue # Component for handling the QR scanning interface and logic
    ScanResultDisplay.vue # Component for displaying the results of a scan
public/
  index.html # Main HTML file to load the Vue application
</user_psuedocode>
<user_psuedocode step="2">
public/
  index.html # Main HTML file to load the Vue application
    Basic HTML document structure
    Head section
      Meta information
      Title
    Body section
      Root element for Vue app mounting
      Script tag to load the main application JavaScript

src/
  main.js # Vue application entry point
    Import Vue necessary functions
    Import the main App component
    Create a new Vue application instance
    Mount the application instance to the root element in index.html

  App.vue # Main application component
    Template section
      Main container div
      Placeholder or inclusion of the QrScanner component
      Placeholder or inclusion of the ScanResultDisplay component
    Script section
      Import QrScanner and ScanResultDisplay components
      Define data properties for scan result storage
      Define methods to handle events from QrScanner (e.g., when a QR code is decoded)
    Style section (optional)
      Basic styles for the main layout

  components/
    QrScanner.vue # Component for handling the QR scanning interface and logic
      Template section
        Video element to display camera feed
        Optional elements for controls (start/stop buttons, camera selection)
      Script section
        Import scanning library (placeholder)
        Define data properties (e.g., camera list, selected camera, scanning state, error messages)
        Define methods to:
          Initialize scanner with selected camera
          Start scanning
          Stop scanning
          Handle successful scan (decode event)
          Handle scan errors
        Lifecycle hooks (e.g., mounted to initialize scanner, beforeDestroy to stop scanner)
        Emits events when a QR code is successfully scanned
      Style section (optional)
        Styles for the video element and controls

    ScanResultDisplay.vue # Component for displaying the results of a scan
      Template section
        Element to display the scanned result text
        Optional elements for action buttons (e.g., copy, open link)
      Script section
        Define props to receive the scan result data
        Define computed properties for formatting or validating the result
        Define methods for actions (e.g., copy result to clipboard)
      Style section (optional)
        Styles for displaying the result
</user_psuedocode>
<user_psuedocode step="3">
  public/
    index.html # Main HTML file to load the Vue application
      Declare document type as HTML5
      Start HTML root element
        Start Head section
          Set character encoding (e.g., UTF-8)
          Set viewport for responsive design
          Set the title of the page (e.g., "QR Scanner App")
        End Head section
        Start Body section
          Create a div element with an ID (e.g., "app") for Vue to mount onto
          Include a script tag pointing to the compiled JavaScript application file (e.g., "/dist/build.js" or similar depending on build setup)
        End Body section
      End HTML root element

  src/
    main.js # Vue application entry point
      Import necessary functions from Vue library (e.g., `createApp`)
      Import the main App component from its file (`./App.vue`)
      Call `createApp` passing the main App component as the root component
      Call the `.mount()` method on the created app instance, targeting the root element defined in `index.html` (e.g., `'#app'`)

    App.vue # Main application component
      Template section
        Main container div
        Placeholder or inclusion of the QrScanner component (e.g., `<qr-scanner />`)
        Placeholder or inclusion of the ScanResultDisplay component (e.g., `<scan-result-display />`)
      Script section
        Import QrScanner component from `./components/QrScanner.vue`
        Import ScanResultDisplay component from `./components/ScanResultDisplay.vue`
        Define component export with:
          `components` property listing imported components (QrScanner, ScanResultDisplay)
          `data()` method returning an object with properties for scan result storage (e.g., `scanResult: null`)
          `methods` object containing functions to handle events (e.g., `handleScanSuccess(result)` method)
      Style section (optional)
        Basic styles for the main layout within `<style scoped>` or `<style>` tags

    components/
      QrScanner.vue # Component for handling the QR scanning interface and logic
        Template section
          Video element with a ref attribute to access it in script
          Optional elements for controls (buttons for start/stop, select dropdown for cameras)
        Script section
          Import scanning library (placeholder, e.g., `instascan` or `quagga2`)
          Define component export with:
            `data()` method returning an object with properties like `cameras: [], selectedCamera: null, isScanning: false, errorMessage: null`
            `methods` object containing functions:
              `initScanner()`: Locate video element using ref, initialize scanner library
              `startScanning()`: Use scanner library to start scanning from the selected camera feed
              `stopScanning()`: Use scanner library to stop scanning
              `handleScanSuccess(content)`: Process the scanned content, emit event with content
              `handleScanError(error)`: Log or display error message
              `listCameras()`: Use scanner library to list available camera devices
              `selectCamera(camera)`: Set the selected camera and re-initialize if scanning
            `mounted()` lifecycle hook: Call `listCameras()` and potentially `initScanner()`
            `beforeDestroy()` lifecycle hook: Call `stopScanning()` to clean up resources
            `emits` property listing events emitted by this component (e.g., `'scan-success'`)
        Style section (optional)
          Styles for the video element and controls within `<style scoped>` tags

      ScanResultDisplay.vue # Component for displaying the results of a scan
        Template section
          Conditional rendering: If scan result exists, display a div
            Paragraph or div to show the received `scanResult` prop
            Optional buttons (e.g., "Copy to Clipboard", "Open Link" - conditionally displayed based on result format)
          Conditional rendering: If scan result is null, display a message (e.g., "Scan a QR code")
        Script section
          Define component export with:
            `props` property defining expected input data (e.g., `scanResult: { type: String, default: null }`)
            `computed` properties:
              `isUrl()`: Check if `scanResult` string looks like a URL
              `displayResult()`: Optional formatting of `scanResult`
            `methods` object:
              `copyResult()`: Use browser API (`navigator.clipboard.writeText`) to copy `scanResult`
              `openLink()`: Open `scanResult` in a new browser tab (`window.open`) - only if `isUrl` is true
        Style section (optional)
          Styles for displaying the result block within `<style scoped>` tags
</user_psuedocode>
<user_psuedocode step="4">
public/
  index.html # Main HTML file to load the Vue application
    Declare document type as HTML5
    Start HTML root element
      Start Head section
        Set character encoding (e.g., UTF-8)
        Set viewport for responsive design
        Set the title of the page (e.g., "QR Scanner App")
      End Head section
      Start Body section
        Create a div element with an ID (e.g., "app") for Vue to mount onto
        Include a script tag pointing to the compiled JavaScript application file (e.g., "/dist/build.js" or similar depending on build setup)
      End Body section
    End HTML root element

src/
  main.js # Vue application entry point
    Import necessary functions from Vue library (e.g., `createApp`)
    Import the main App component from its file (`./App.vue`)
    Call `createApp` passing the main App component as the root component
    Call the `.mount()` method on the created app instance, targeting the root element defined in `index.html` (e.g., `'#app'`)

  App.vue # Main application component
    Template section
      Main container div
        Include the QrScanner component, listening for its 'scan-success' event and calling `handleScanSuccess` method
        Include the ScanResultDisplay component, passing `scanResult` as a prop and listening for its 'clear-result' event and calling `clearScanResult` method
    Script section
      Import QrScanner component from `./components/QrScanner.vue`
      Import ScanResultDisplay component from `./components/ScanResultDisplay.vue`
      Define component export with:
        `components` property listing imported components (QrScanner, ScanResultDisplay)
        `data()` method returning an object with properties for scan result storage (e.g., `scanResult: null`)
        `methods` object containing functions:
          `handleScanSuccess(result)`:
            Set `this.scanResult` to the value of the received `result`.
          `clearScanResult()`:
            Set `this.scanResult` to `null`.
    Style section (optional)
      Basic styles for the main layout within `<style scoped>` or `<style>` tags

  components/
    QrScanner.vue # Component for handling the QR scanning interface and logic
      Template section
        Div container for the scanner interface
          Video element with a ref attribute named 'scanner-video' to display the camera feed
          Conditional display for camera selection UI (`v-if="cameras.length > 1"`):
            Label for camera selection
            Select dropdown element (`<select v-model="selectedCameraId">`)
              Loop through `cameras` array (`v-for="camera in cameras"`):
                Option element for each camera, displaying camera name (`{{ camera.name }}`)
                Set the option value to the camera ID (`:value="camera.id"`)
          Conditional display for scanner controls (`v-if="selectedCameraId"`):
            Button to start scanning (`v-if="!isScanning" @click="startScanning"`), label: "Start Scan"
            Button to stop scanning (`v-if="isScanning" @click="stopScanning"`), label: "Stop Scan"
          Conditional display for error messages (`v-if="errorMessage"`):
            Paragraph or div to show the `errorMessage` text
      Script section
        Import the scanning library (e.g., `import { Camera, Scanner } from 'instascan';`)
        Define component export with:
          `data()` method returning an object with properties like `cameras: [], selectedCameraId: null, isScanning: false, errorMessage: null, scanner: null` # Use camera ID for selection model
          `methods` object containing functions:
            `listCameras()`:
              Call `Camera.getCameras()`.
              Handle the returned Promise:
                `.then(cameras => { ... })`:
                  Store the returned array in `this.cameras`.
                  If `this.cameras.length` is greater than 0:
                    Set `this.selectedCameraId` to the `id` of the first camera (`cameras[0].id`).
                    Clear any existing `errorMessage`.
                  Else (no cameras found):
                    Set `this.errorMessage` to "No cameras found.".
                    Set `this.selectedCameraId` to null.
                `.catch(err => { ... })`:
                  Set `this.errorMessage` based on the error (e.g., "Failed to list cameras: " + err.message).
                  Set `this.cameras` to an empty array and `this.selectedCameraId` to null.
            `initScanner()`:
              Get the video element reference using `this.$refs['scanner-video']`.
              If `this.selectedCameraId` is set and the video element exists:
                Ensure any existing scanner instance is stopped and cleared first (call `this.stopScanning(true)` - add parameter to skip setting isScanning=false).
                Create a new instance of the scanning library (e.g., `new Scanner({ video: videoElement, mirror: false, scanPeriod: 5 })`).
                Assign the instance to `this.scanner`.
                Register event listeners on the `this.scanner` instance:
                  `this.scanner.addListener('scan', this.handleScanSuccess);`
                  `this.scanner.addListener('error', this.handleScanError);`
                Clear any previous `errorMessage`.
              Else (no camera selected or video element missing):
                If `this.cameras.length > 0` but no `selectedCameraId`, set error "No camera selected.".
                If video element is missing, set error "Video element not found.".
            `startScanning()`:
              If `this.scanner` exists and `this.selectedCameraId` is set:
                Call the scanning library's start method on `this.scanner`, passing the selected camera ID (e.g., `this.scanner.start(this.selectedCameraId)`).
                Handle the returned Promise:
                  `.then(() => { this.isScanning = true; this.errorMessage = null; })`: Set `isScanning` to true and clear errors on success.
                  `.catch(err => { this.handleScanError(err); })`: Handle errors during start (e.g., permission denied).
              Else:
                Attempt to `initScanner()`. If successful, then call `startScanning()` again. If not, set an `errorMessage`.
            `stopScanning(keepScanningState = false)`: # Added parameter for internal use
              If `this.scanner` exists:
                Call the scanning library's stop method (e.g., `this.scanner.stop()`).
                # Scanning libraries might automatically remove listeners on stop, but explicitly removing is safer if needed
                # this.scanner.removeListener('scan', this.handleScanSuccess);
                # this.scanner.removeListener('error', this.handleScanError);
                # Set this.scanner to null after stopping
                # this.scanner = null; # Clear the instance reference
                If `keepScanningState` is false, set `this.isScanning` to false.
              Else:
                If `keepScanningState` is false, set `this.isScanning` to false.
            `handleScanSuccess(content)`:
              Log the scanned `content`.
              Call `this.stopScanning()`.
              Emit the 'scan-success' event with `content`.
            `handleScanError(error)`:
              Log the error object.
              Set `this.errorMessage` to a user-friendly string based on known error types (e.g., "Camera access denied. Please grant permissions.", "Scanning failed, try again.").
              Call `this.stopScanning()`.
            `selectCamera()`: # Method triggered by v-model update on select
              # The `selectedCameraId` data property is automatically updated by v-model
              # Stop the current scanner if running
              # Re-initialize the scanner with the new camera ID
              # If it was scanning before, restart scanning
              const wasScanning = this.isScanning;
              if (this.scanner) {
                 this.stopScanning();
              }
              this.initScanner();
              if (wasScanning && this.scanner) { # Check if init was successful
                this.startScanning();
              } else if (wasScanning && !this.scanner) {
                this.errorMessage = this.errorMessage || "Failed to initialize scanner with selected camera.";
              }

          `watch` property: # Watch for changes to selectedCameraId to automatically re-initialize
            `selectedCameraId(newId, oldId)`:
               if (newId !== oldId) {
                 this.selectCamera(); # Call the method that handles stopping, initializing, and starting
               }

          `mounted()` lifecycle hook:
            Call `listCameras()`.
            After `listCameras` Promise resolves successfully:
              If `this.selectedCameraId` is set, call `initScanner()`.
              # Decide whether to auto-start here or wait for user click
              # If auto-start: if (this.scanner) this.startScanning();
          `beforeUnmount()` lifecycle hook: # Renamed from beforeDestroy in Vue 3
            Call `stopScanning()`.
          `emits` property listing events emitted: `'scan-success'`
      Style section (optional)
        Styles for the container, video element, controls, and error messages within `<style scoped>` tags

    ScanResultDisplay.vue # Component for displaying the results of a scan
      Template section
        Div container for the result display
          Conditional rendering: Use `v-if="scanResult"` to display result block when `scanResult` prop is not null:
            Heading or label: "Scan Result:"
            Paragraph or div element to show the received `scanResult` prop, potentially with formatting using `{{ displayResult }}`
            Div for action buttons
              Conditional display for "Open Link" button (`v-if="isUrl"`):
                Button element with label "Open Link" (`@click="openLink"`)
              Button element with label "Copy to Clipboard" (`@click="copyResult"`)
              Button element with label "Scan Again" (`@click="requestScanAgain"`)
            Conditional display for copy confirmation message (`v-if="copiedConfirmation"`):
              Span or paragraph element showing a message like "Copied!"
          Conditional rendering: Use `v-else` to display initial message when `scanResult` prop is null:
            Paragraph or heading element: "Scan a QR code to see the result here."
      Script section
        Define component export with:
          `props` property defining expected input data (e.g., `scanResult: { type: String, default: null }`)
          `data()` method returning an object for component state (e.g., `copiedConfirmation: false, confirmationTimeout: null`) # Store timeout ID for cleanup
          `computed` properties:
            `isUrl()`:
              Check if `this.scanResult` is a string and matches a regular expression pattern for URLs.
              A simple regex like `/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i` can be used.
              Return `true` if it matches, `false` otherwise.
            `displayResult()`:
              Return `this.scanResult || 'No result available'`. # Provide default text if null
              Could add logic here to truncate long results.
          `methods` object:
            `copyResult()`:
              Check if `this.scanResult` is not null.
              Use `navigator.clipboard.writeText(this.scanResult)` API.
              Handle the returned Promise:
                `.then(() => { ... })`:
                  Clear any existing confirmation timeout (`clearTimeout(this.confirmationTimeout)`).
                  Set `this.copiedConfirmation` to `true`.
                  Set a new timeout (`this.confirmationTimeout = setTimeout(...)`) to set `this.copiedConfirmation` back to `false` after a delay (e.g., 2000ms).
                `.catch((err) => { ... })`:
                  Log the error to the console (`console.error('Copy failed:', err)`).
                  # Optionally, set an error message state here if needed.
            `openLink()`:
              Check if `this.scanResult` is not null and `this.isUrl` is true.
              Use `window.open(this.scanResult, '_blank')`. # Open in a new tab
              # Consider wrapping in try/catch or checking returned window object for pop-up blockers, but maybe too detailed for this step.
            `requestScanAgain()`:
              Emit the custom event named 'clear-result' using `this.$emit('clear-result')`.
          `beforeUnmount()` lifecycle hook: # Renamed from beforeDestroy in Vue 3
            Clear the copy confirmation timeout if it's active (`clearTimeout(this.confirmationTimeout)`).
          `emits` property listing events emitted: `'clear-result'`
      Style section (optional)
        Styles for the result block, buttons, confirmation message, etc., within `<style scoped>` tags
</user_psuedocode>

<instructions>
    <core_task>
    Your job is to take psuedocode and convert it one step forwards in the psuedocode generation. Never write actual code, simply take the psuedocode one step forward.
    </core_task>

    <output_rules>
    Always write in psuedocode. Your psuedocode can either be UI structure, or function and algorithm psuedocode. Your psuedocode should be modular, easy to maintain and understand. You can add comments in the psuedocode if absolutely needed by starting a line with "#" but these should only be about implementation details, not the code itself or its structure, e.g. code style guidelines, justification, etc. All sections of psuedocode should be self contained, this means that updating one section of the psuedocode shouldn't necessitate updating other sections. Act like you're writing real code, but only write psuedocode. Only write psuedocode.

    All functions you write should have signatures each section of the psuedocode should stand on its own.
    </output_rules>

    <process_and_step_definition>
    The new psuedocode replaces the old psuedocode by the user. You can think of one step as one more indentation level. Take the user's prompt forward one step only. Be careful not to write too much. Only go one step at a time. Only output false once the psuedocode can only be written one way once made into code.
    </process_and_step_definition>

    <organization>
    Organize your psuedocode based on the way actual code would be organized (folder -> file -> functions/structure within file). Start with the outermost step.
    </organization>

    <output_format>
    Your output should have one <step> tag with the new updated psuedocode within and a <moreStepsNeeded>[true|false]</moreStepsNeeded>. All output should be plain text with abstraction levels represented by indentation. All step content should be in plain english and should progress the psuedocode forward ONE STEP ONLY. Only write psuedocode, never actual code, and continue until no more details can be added and the only step is to convert to actual code.
    </output_format>
</instructions>
<application>QR Scan app with JS and HTML and vue</application>
<user_prompt>Make a feature rich app</user_prompt>
</task>

<goal_for_now>
Now output the final, full, professional, comprehensive, modular and complete code based on the psuedocode. Put each file into a <file path="relative/path/to/file.js"> tag with the content. Your output should include file tags for each file, a <meta><title>[Title of the app]</title><description>[Description of the app]</description></meta> and then <run_instructions> in markdown
</goal_for_now>
