FROM mcr.microsoft.com/dotnet/core/aspnet:2.2-stretch-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:2.2-stretch AS build
WORKDIR /src
COPY ["MijnApp-Backend/MijnApp-Backend.csproj", "MijnApp-Backend/"]
COPY ["MijnApp.Domain/MijnApp.Domain.csproj", "MijnApp.Domain/"]
RUN dotnet restore "MijnApp-Backend/MijnApp-Backend.csproj"
COPY . .
WORKDIR "/src/MijnApp-Backend"
RUN dotnet build "MijnApp-Backend.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MijnApp-Backend.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MijnApp-Backend.dll"]