FROM mcr.microsoft.com/dotnet/core/aspnet:3.0-bionic AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM node
WORKDIR /src
COPY . .
RUN npm install
RUN npm run build:prod

FROM mcr.microsoft.com/dotnet/core/sdk:3.0-bionic AS build
WORKDIR /src
COPY ["MijnApp-Frontend/MijnApp-Frontend.csproj", "MijnApp-Frontend/"]
RUN dotnet restore "MijnApp-Frontend/MijnApp-Frontend.csproj"
COPY . .
WORKDIR "/src/MijnApp-Frontend"
RUN dotnet build "MijnApp-Frontend.csproj" -c Release -o /app/build


FROM build AS publish
RUN dotnet publish "MijnApp-Frontend.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MijnApp-Frontend.dll"]
