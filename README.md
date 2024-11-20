# FXQL Parser - Foreign Exchange Query Language Parser

## 📌 Overview
FXQL Parser is a NestJS-based service for parsing and storing foreign exchange rate information using a custom query language.

## 🚀 Features
- Parse complex FXQL statements
- Validate currency pairs and exchange rates
- Store exchange rate information in PostgreSQL
- Docker and Docker Compose support
- Swagger API documentation

## 🛠 Local Development Setup

### Prerequisites
- Node.js (18.x)
- Yarn
- Docker (optional)

### Installation
```bash
# Clone the repository
git clone https://github.com/afkzoro/FXQL-statement-parser.git
cd FXQL-statement-parser

# Install dependencies
yarn install

# Copy environment template
cp .env.example .env
```

### Environment Variables
Create a `.env` file with the following configuration:
```
DB_HOST=
DB_PORT=5432
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
```

### Running the Application

#### Development Mode
```bash
# Start development server
yarn start:dev
```

#### Production Mode
```bash
# Build the application
yarn build

# Start production server
yarn start:prod
```


## 📖 API Documentation

### Swagger UI
Access Swagger documentation at: `http://localhost:3000/api-docs`

### FXQL Statement Endpoint
- **URL:** `/`
- **Method:** `POST`
- **Content-Type:** `application/json`

#### Request Body Example
```json
{
  "FXQL": "USD-GBP { BUY 100 SELL 200 CAP 93800 }"
}
```

#### Successful Response
```json
{
  "message": "Rates Parsed Successfully.",
  "code": "FXQL-200",
  "data": [
    {
      "EntryId": 192,
      "SourceCurrency": "USD",
      "DestinationCurrency": "GBP",
      "SellPrice": 200,
      "BuyPrice": 100,
      "CapAmount": 93800
    }
  ]
}
```

## 🔍 Design Decisions
- Used NestJS for robust TypeScript backend
- PostgreSQL for persistent storage
- Docker for containerization
- Comprehensive input validation
- Swagger for API documentation

## 🧪 Testing
```bash
# Run unit tests
yarn test

# Run end-to-end tests
yarn test:e2e
```

## 📋 FXQL Statement Rules
- Maximum 1000 currency pairs per request
- Currency codes must be 3 uppercase letters
- Numeric validations for buy/sell rates
- Integer validation for transaction cap

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
