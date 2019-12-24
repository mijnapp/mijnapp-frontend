For some configuration items we need secrets which are not to be added to the repository. For instance the shared secret for connecting to the DigiD server.
For this to function, every developer needs to:

1. Create the directory C:\UserSecrets\320e50fc-0267-417b-965b-f4c06031b254
2. Using visual studio (or  using 'dotnet user-secrets') you can manage the user secrets for this project
	The appsettings.json shows which items have to be present in the secrets.json. It needs to have the same structure and will overwrite the settings in appsettings.json

When (re-)building the MijnApp-Backend project, the secrets.json from your user profile will be copied to C:\UserSecrets\320e50fc-0267-417b-965b-f4c06031b254.
When running the MijnApp-Backend project in DEBUG mode, this file is added as a configuration source and therefore it will use those secrets,
even when running the backend in IIS under a different user account (application pool).

# Settings
  * Origins (Sets the crossorigin header, you can enter a ; separated list IE: http://localhost:3000;https://localhost:3001")
  * HasFakeLoginEnabled (Set if the backend will allow the FakeInlog, should always be false on production)
  * Api (settings for the external api's)
    * AddressUri (Sets the uri for the address component)
    * BrpUri  (Sets the uri for the person component)
    * OrderUri (Sets the uri for the order component)
    * ProcessUri (Sets the uri for the process component)
  * JWT (Json Web Token)
    * Key (THIS IS A SECRET KEY so keep it hidden for production also do not use the value in this project)
    * Issuer (Sets the issuer of the JWT),
    * ExpirationInMinutes 
      * Fake (Sets how long the fake logon will last, set to 0 on production)
      * DigidCgi (Sets how long the DIGID logon will last, set it less then the DigId timeout)
  * DigidCgi (DigId connection settings)
    * SiamServer (Set the uri of the server)
    * ApplicationId (Set the name of the application)
    * SiamServerName (Set the name of the server)
    * SharedSecret": (THIS IS A SECRET KEY so keep it hidden for production also do not use the value in this project)
  * JwtClaimEncryption (For encryption of some valuable data)
    * SecretKey": (THIS IS A SECRET KEY so keep it hidden for production also do not use the value in this project. MIN LENGTH:16, MAX LENGTH: 32 characters)