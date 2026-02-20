# EC2 Server Setup Guide

> Run these commands in your EC2 terminal (browser or SSH).
> If you are logged in as **root**, remove `sudo` from all commands.

---

## Step 1 — Update Packages

```bash
apt update && apt upgrade -y
```

---

## Step 2 — Install Node.js 18

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
```

Verify:

```bash
node -v
npm -v
```

---

## Step 3 — Install PM2

```bash
npm install -g pm2
```

---

## Step 4 — Install Git

```bash
apt install -y git
```

---

## Step 5 — Clone Your Repo

```bash
git clone https://github.com/chandraprakash9589/nextjs-razorpay-courses.git
cd nextjs-razorpay-courses/server
```

---

## Step 6 — Install Dependencies

```bash
npm install
```

---

## Step 7 — Create `.env` File

```bash
nano .env
```

Paste the following and fill in your real values:

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/coursesell
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLIENT_URL=https://your-app.vercel.app
```

Save: `Ctrl+X` → `Y` → `Enter`

---

## Step 8 — Start Server with PM2

```bash
pm2 start index.js --name "coursesell-api"
pm2 startup
pm2 save
```

---

## Step 9 — Test Server

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{ "status": "ok" }
```

---

## Useful PM2 Commands

| Command | Description |
|---|---|
| `pm2 list` | See all running apps |
| `pm2 logs coursesell-api` | View live logs |
| `pm2 restart coursesell-api` | Restart the server |
| `pm2 stop coursesell-api` | Stop the server |

---

## Your Live API URL

```
http://52.66.238.21:5000/api
```
http://52.66.238.21:5000/api
---

## Notes

- Never commit your `.env` file to GitHub
- Make sure port `5000` is open in your EC2 Security Group
- Set `CLIENT_URL` to your Vercel frontend URL to allow CORS
