FROM mcr.microsoft.com/dotnet/core/aspnet:2.2 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:2.2 AS build
WORKDIR .

#COPY src/MijnApp.Domain/MijnApp.Domain.csproj /src/csproj-files/

COPY . .
WORKDIR ./MijnApp-Backend
RUN dotnet publish -c Release -o /app

#FROM build as unittest
#WORKDIR /src/src/Services/Basket/Basket.UnitTests

#FROM build as functionaltest
#WORKDIR /src/src/Services/Basket/Basket.FunctionalTests
#
FROM build AS publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "MijnApp-Backend.dll"]