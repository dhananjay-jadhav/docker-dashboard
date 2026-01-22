# 🚢 Docker Dashboard

A clean and modern web dashboard for **managing and monitoring your local Docker containers**—with real-time control and logs, all in your browser.

---

## ✨ Features

- **Overview**: Instantly see all local Docker containers (running & stopped)
- **Controls**: Start, stop, and remove containers
- **Logs**: View real-time container logs in the UI
- **Responsive UI**: Works great on desktop and mobile
- **Automatic Refresh**: Always up-to-date container statuses

---

## 🏗️ Architecture

This project is organized as a full-stack monorepo:

- **Frontend**:  
  - [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (in `/client`)
  - Modern, minimalist design
- **Backend**:  
  - [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) ([TypeScript](https://www.typescriptlang.org/), in `/server`)
  - Communicates with Docker using [Dockerode](https://github.com/apocas/dockerode)

---

## 🚀 Quick Start

### 1. Prerequisites

- [Docker](https://www.docker.com/get-started) **must** be installed and running locally
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Yarn v4+](https://yarnpkg.com/)  
  *(Note: This project uses Yarn as its package manager)*

### 2. Clone the repository

```sh
git clone https://github.com/dhananjay-jadhav/docker-dashboard.git
cd docker-dashboard
```

### 3. Start the Backend

```sh
cd server
yarn install
yarn start
```
Backend will start on **http://localhost:5002**

### 4. Start the Frontend

Open a new terminal window:
```sh
cd client
yarn install
yarn start
```
Frontend runs on **http://localhost:3000**

---

## 🧑‍💻 Usage

- Open [http://localhost:3000](http://localhost:3000) in your browser.
- **View your containers:** Names, status, and IDs listed instantly.
- **Start/Stop/Delete:** Use action buttons to control container state quickly.
- **View Logs:** Click to expand real-time logs for any container.

---

## 🗂️ Repository Structure

```
docker-dashboard/
├── client/        # React + TS frontend
│   └── ...        
├── server/        # Node + TS backend API (Dockerode)
│   └── ...
├── README.md
└── LICENSE
```

---

## 🔐 Security

- **Local only:** By default, the dashboard only controls your local Docker daemon.
- *Not* intended for production/public or multi-user setups out of the box.

---

## 📝 License

This project is licensed as [Public Domain (Unlicense)](./LICENSE).

---

## 🙌 Credits

Developed by [@dhananjay-jadhav](https://github.com/dhananjay-jadhav).  
Powered by open source: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Express](https://expressjs.com/), [Dockerode](https://github.com/apocas/dockerode).

---

## 💡 Notes & Contributions

- **Pull requests & issues welcome!**  
  If you spot a bug or want to add new features, feel free to contribute.
- For improvements or questions, [open an issue](https://github.com/dhananjay-jadhav/docker-dashboard/issues).

---

> _Manage your local Docker. Fast. Simple. No CLI required._
