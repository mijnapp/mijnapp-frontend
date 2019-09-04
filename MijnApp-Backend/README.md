For some configuration items we need secrets which are not to be added to the repository. For instance the shared secret for connecting to the DigiD server.
For this to function, every developer needs to:

1. Create the directory C:\UserSecrets\320e50fc-0267-417b-965b-f4c06031b254
2. Using visual studio (or  using 'dotnet user-secrets') you can manage the user secrets for this project
	The appsettings.json shows which items have to be present in the secrets.json. It needs to have the same structure and will overwrite the settings in appsettings.json

When (re-)building the MijnApp-Backend project, the secrets.json from your user profile will be copied to C:\UserSecrets\320e50fc-0267-417b-965b-f4c06031b254.
When running the MijnApp-Backend project in DEBUG mode, this file is added as a configuration source and therefore it will use those secrets,
even when running the backend in IIS under a different user account (application pool).