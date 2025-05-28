# application: CLI to download all gists of a user
# details: Feature rich CLI app with Bun to download all gists of a user
# step: 3
# more: true
----
# Design Guidelines:
# - CLI commands should be clear and concise.
# - User feedback should be immediate and informative.
# - Error messages should guide the user on how to fix issues.
# - Follow a modular structure with clear function responsibilities.
# - Adhere to functional programming principles where applicable, ensuring functions are pure where possible.
# - Handle all potential error paths gracefully.

# Implementation Guidelines:
# - Use a command-line argument parsing library if available in Bun/JS context.
# - Define constants for API endpoints, file paths, and messages.
# - Implement robust error handling for network requests (timeouts, status codes).
# - Implement file system operations with error checks (permissions, disk space).
# - Use structured logging or console output for reporting.
# - When executing external commands (e.g., `gh auth token`), ensure error handling for command not found or non-zero exit codes.

# Principles to Adhere To:
# - Separation of concerns: Each module/function has a single, well-defined purpose.
# - Fail fast: Identify and report errors as early as possible.
# - User-centric design: Prioritize the user's experience and ease of use.

Application entry point:
  Function `main`():
    Input: None
    Output: None

    Get raw command-line arguments

    Call `parseArguments(rawArguments)` -> `username` or `parseError`

    If `parseError` occurred:
      Call `displayUsageInstructions()`
      Call `reportError("Missing username argument", parseError.message)`
      Return

    Set `username` to the parsed username

    Call `validateUsername(username)` -> `isValid` (boolean)

    If `isValid` is false:
      Call `displayUsageInstructions()`
      Call `reportError("Invalid username provided", "Username does not meet requirements.")`
      Return

    Call `getAuthToken()` -> `authToken` or `tokenError`

    If `tokenError` occurred:
      # Proceed without token, gists might be public only.
      Call `reportWarning("Failed to retrieve authentication token", tokenError.message)`
      Set `authToken` to null
      # Optionally, exit here if private gist access is mandatory. For now, continue.

    Call `fetchUserGists(username, authToken)` -> `gistList` or `fetchError`

    If `fetchError` occurred:
      Call `reportError("Failed to fetch gists", fetchError.message)`
      Return

    If `gistList` is empty:
      Call `reportSuccess("No gists found for user", username)`
      Return

    Call `saveGistsToDisk(gistList)` -> `saveResult` (success/failure status)

    If `saveResult` indicates success:
      Call `reportSuccess("Gists downloaded successfully", gistList.count)`
    Else (`saveResult` indicates failure):
      Call `reportError("Failed to save gists", saveResult.message)`

  Function `parseArguments(args)`:
    Input: `args` (list of strings, raw command-line arguments, e.g., `process.argv` from Bun/Node.js)
    Output: `username` (string) or `error` (object with type and message properties)

    Define `MINIMUM_ARGUMENT_COUNT` as 3 (e.g., interpreter, script, username)
    Define `USERNAME_ARG_INDEX` as 2

    If `args.length` is less than `MINIMUM_ARGUMENT_COUNT`:
      Create an error object:
        Set `type` property to "MISSING_ARGUMENT"
        Set `message` property to "Username argument is missing."
      Return the created error object
    Else:
      Set `potentialUsername` to the string element at `USERNAME_ARG_INDEX` in `args`
      Return `potentialUsername`

  Function `validateUsername(username)`:
    Input: `username` (string)
    Output: `isValid` (boolean)

    Define `MIN_USERNAME_LENGTH` constant (e.g., 1)
    Define `MAX_USERNAME_LENGTH` constant (e.g., 39, GitHub's max)
    Define `ALLOWED_USERNAME_PATTERN` constant (e.g., a regular expression for alphanumeric characters and hyphens)

    If `username` is null or empty:
      Return false

    If `username.length` is less than `MIN_USERNAME_LENGTH` or greater than `MAX_USERNAME_LENGTH`:
      Return false

    If `username` does not match `ALLOWED_USERNAME_PATTERN`:
      Return false

    Return true

  Function `getAuthToken()`:
    Input: None
    Output: `authToken` (string) or `tokenError` (object containing error details)

    Define `GH_CLI_COMMAND` constant for the `gh` executable path
    Define `TOKEN_SUBCOMMAND_ARGS` constant for `auth token`

    Execute external command: `GH_CLI_COMMAND` with `TOKEN_SUBCOMMAND_ARGS`
      Capture standard output
      Capture standard error
      Capture exit code

    If exit code is not 0 (indicating an error):
      Create an error object:
        Set `type` property to "COMMAND_EXECUTION_ERROR"
        Set `message` property to "Failed to retrieve token from 'gh cli'. Error: " + captured standard error
      Return the created error object
    Else:
      Trim whitespace from the captured standard output (the token)
      If the trimmed token is empty:
        Create an error object:
          Set `type` property to "TOKEN_NOT_FOUND"
          Set `message` property to "No token found from 'gh auth token' command."
        Return the created error object
      Return the trimmed token

  Function `fetchUserGists(username, authToken)`:
    Input: `username` (string), `authToken` (string or null)
    Output: `gistList` (list of gist objects) or `fetchError` (object containing error details)
    # This function is responsible for making the API call.
    # It will use the `authToken` in the request headers if provided.

  Function `saveGistsToDisk(gistList)`:
    Input: `gistList` (list of gist objects)
    Output: `saveResult` (object with status and message)
    # This function handles writing gist content to the file system.

  Function `reportSuccess(title, details)`:
    Input: `title` (string), `details` (string or number, optional)
    Output: None
    # This function will print a success message to the console.

  Function `reportWarning(title, details)`:
    Input: `title` (string), `details` (string, optional)
    Output: None
    # This function will print a warning message to the console.

  Function `reportError(title, details)`:
    Input: `title` (string), `details` (string, optional)
    Output: None
    # This function will print an error message to the console.

  Function `displayUsageInstructions()`:
    Input: None
    Output: None
    # This function will print help text on how to use the CLI.