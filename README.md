# weeek-33-zapier

A multi-service project with frontend, backend, workers, and integration hooks — designed around automation flows similar to Zapier.  
Frontend is live here 👉 [zapier-frontend-lake.vercel.app](https://zapier-frontend-lake.vercel.app/)

---

## 📂 Project Structure

```
├── frontend          # React/Next.js app (deployed on Vercel)
├── primary-backend   # Main backend API server
├── hooks             # Webhook/event integrations
├── processor         # Processing jobs/tasks
├── worker            # Background workers
└── .vscode           # Editor config
```

---

## 🚀 Features

- **Frontend** UI for interacting with the system
- **Backend API** to manage requests and logic
- **Hooks** for external triggers
- **Processor** to handle job pipelines
- **Worker** for async/background tasks

---

## 🛠 Tech Stack

- **Language**: TypeScript  
- **Frontend**: React/Next.js  
- **Backend**: Node.js + Express/Fastify (adjust as needed)  
- **Workers**: Node.js worker processes / job queue  
- **Deployment**: Vercel (frontend), other services can be deployed to Railway/Heroku/AWS/etc.  

---

## ⚙️ Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/Nileshsri2022/weeek-33-zapier.git
   cd weeek-33-zapier
   ```

2. Install dependencies for each service:
   ```bash
   cd frontend && npm install
   cd ../primary-backend && npm install
   cd ../hooks && npm install
   cd ../processor && npm install
   cd ../worker && npm install
   ```

3. Set up environment variables (`.env` in each service):
   ```env
   PORT=3000
   DATABASE_URL=your_database_url
   API_KEY=your_api_key
   ZAPIER_WEBHOOK_URL=your_webhook
   ```

---

## ▶️ Running Locally

Start each service in dev mode:
```bash
npm run dev
```

For example:
```bash
cd frontend && npm run dev
```

Backend / workers:
```bash
cd primary-backend && npm run dev
```

---

## 🌐 Deployment

- **Frontend**: deployed on Vercel → [zapier-frontend-lake.vercel.app](https://zapier-frontend-lake.vercel.app/)  
- **Backend/Workers**: can be deployed to Railway, Render, AWS, or similar cloud platforms.  

---

## 🤝 Contributing

1. Fork the repo  
2. Create your feature branch (`git checkout -b feature/my-feature`)  
3. Commit changes (`git commit -m "Add new feature"`)  
4. Push to branch (`git push origin feature/my-feature`)  
5. Open a Pull Request  

---

## 📜 License

This project is licensed under the MIT License.  
