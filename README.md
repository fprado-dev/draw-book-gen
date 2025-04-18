# AI Coloring Book Generator

An innovative web application that uses AI to generate custom coloring pages for various purposes - from educational materials to professional coloring books.

## Features

- **AI-Powered Generation**: Create unique coloring pages using advanced AI algorithms
- **Multiple Art Styles**: Choose from various styles including Kawaii, Lowpoly, and more
- **Customization Options**: Control line weight, detail level, and design elements
- **Print-Ready Output**: All generated pages are optimized at 300 DPI for professional printing
- **User-Friendly Interface**: Intuitive design tools for easy page creation
- **Instant Downloads**: Get your coloring pages immediately after generation

## Prerequisites

Before you begin, ensure you have installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Installation

1. Clone the repository:

```bash
git clone [your-repository-url]
cd draw-book-gen
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   - Copy the `.env.example` file to `.env`
   - Fill in your Firebase configuration values

```bash
cp .env.example .env
```

## Development

To start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
draw-book-gen/
├── src/
│   ├── app/          # Next.js app directory
│   ├── components/   # Reusable UI components
│   ├── contexts/     # React contexts
│   ├── lib/          # Utility functions
│   ├── services/     # External service integrations
│   └── types/        # TypeScript type definitions
├── public/          # Static files
└── [configuration files]
```

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) with React
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with shadcn/ui
- **Type Safety**: TypeScript

## Target Users

- Teachers creating educational materials
- Parents looking for personalized coloring activities
- Businesses developing branded coloring books
- Artists generating base templates
- Publishers producing coloring books
- Therapists designing mindfulness activities

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

#### TODO

TODO: INFOS

- [x] Get count of Pages generated
- [x] Get count of Images generated
- [x] Get count of Books generated
- [x] Get count of Projects generated

TODO: Chart

- [ ] Get Count of Images generated per range
- [ ] Get Current Credits per range

- Billing Page

- [ ] ROI Calculator

- AI Images Page

- [ ] Nova Tela
