# Catholic Mass Song Generator

A modern React application designed to automate the generation of song schedules for Catholic mass, ensuring compliance with the Liturgical calendar and enhancing the planning process for choirs and music directors.

## Features

- **Automated Scheduling**:  Automatically generates song lists for the four key parts of the mass:
    - **Ca Nhập Lễ** (Entrance)
    - **Ca Tiến Lễ** (Offertory)
    - **Ca Hiệp Lễ** (Communion)
    - **Ca Kết Lễ** (Recessional)
- **Liturgical Season Awareness**: Adapts song selection based on the current liturgical season (Advent, Christmas, Lent, Easter, Ordinary Time).
- **Laudato SI Integration**: Fully integrated with the "TuyenTapThanhCa Laudato SI" song collection.
- **Shareable Schedules**: Generate deterministic, unique URLs for any generated schedule, allowing for easy sharing among choir members.
- **Modern Glassmorphism UI**: Features a beautiful, responsive interface designed with modern aesthetics and readability in mind.
- **Export Capabilities**: 
    - Export schedules to CSV for easy printing or editing.
    - Copy schedules directly to the clipboard.

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (Custom Glassmorphism Design System)
- **Language**: JavaScript (ES Modules)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd songs_generator
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## Usage

1.  **Generate a Schedule**: The app will automatically generate a schedule based on the current settings.
2.  **Customize**: Click the "Regenerate" button next to any song to swap it with another suitable option from the database.
3.  **Share**: Click the "Share" button to copy a unique link to your current schedule configuration.
4.  **Export**: Use the "Export to CSV" button to download the schedule.

## License

This project is for personal and community use.
