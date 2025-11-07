# 🗄️ Multi-Source Storage Setup Guide

This guide will help you set up **Cloudflare R2** (Primary) and **GitHub Releases** (Fallback) for your GLB model.

---

## 🎯 Strategy Overview

```
Loading Priority:
1. Cloudflare R2 (Primary) → 10GB free, unlimited bandwidth
2. GitHub Releases (Fallback) → Unlimited storage, reliable
3. Vercel Blob (Current) → Already configured
4. Local File (Dev) → /portfolio-room.min.glb
```

Your portfolio will automatically try each source in order until one works!

---

## 📋 Part 1: Setup Cloudflare R2 (Primary)

### Step 1: Create Cloudflare Account
1. Go to [cloudflare.com](https://cloudflare.com)
2. Sign up for free (no credit card required)
3. Verify your email

### Step 2: Enable R2
1. Login to Cloudflare Dashboard
2. Click **R2** in the left sidebar
3. Click **Create Bucket**
4. Bucket name: `portfolio-assets` (or any name)
5. Location: **Automatic** (best performance)
6. Click **Create bucket**

### Step 3: Upload Your GLB File
1. Click on your new bucket
2. Click **Upload**
3. Select `portfolio-room.min.glb` from your `public/` folder
4. Wait for upload to complete (200MB might take a few minutes)

### Step 4: Make It Public
1. In your bucket, click **Settings**
2. Scroll to **Public Access**
3. Click **Connect Domain** or **Allow public access**
4. Choose **R2.dev subdomain** (free option)
5. Your bucket gets a URL like: `https://pub-xxxxx.r2.dev`

### Step 5: Get Your Public URL
Your GLB URL will be:
```
https://pub-xxxxx.r2.dev/portfolio-room.min.glb
```

### Step 6: Update Config
Open `src/blob-config.json` and add:
```json
{
  "sources": {
    "cloudflareR2": "https://pub-xxxxx.r2.dev/portfolio-room.min.glb",
    "githubRelease": "",
    "vercelBlob": "https://ih4hmkjuh0idhrgl.public.blob.vercel-storage.com/portfolio-room.min.glb"
  },
  ...
}
```

### ✅ R2 Setup Complete!

**Benefits:**
- ✅ 10GB free storage
- ✅ Unlimited bandwidth (no egress fees!)
- ✅ Global CDN
- ✅ Fast loading worldwide

---

## 📋 Part 2: Setup GitHub Releases (Fallback)

This is the **easiest** option and provides unlimited storage!

### Step 1: Prepare Your Repository
Make sure your portfolio code is pushed to GitHub.

### Step 2: Create a Release
1. Go to your GitHub repository
2. Click **Releases** (right sidebar)
3. Click **Create a new release**

### Step 3: Configure Release
1. **Tag version**: `v1.0.0-assets` (or any version)
2. **Release title**: `3D Model Assets v1.0.0`
3. **Description**: 
   ```
   Portfolio 3D model assets
   - portfolio-room.min.glb (optimized GLB model)
   ```

### Step 4: Upload GLB File
1. In the release form, scroll to **Attach binaries**
2. Drag and drop `public/portfolio-room.min.glb`
3. Wait for upload (GitHub supports files up to 2GB)

### Step 5: Publish Release
1. Click **Publish release**
2. Your release is now live!

### Step 6: Get Asset URL
1. Find your release on the Releases page
2. Right-click on `portfolio-room.min.glb`
3. Click **Copy link address**

The URL will look like:
```
https://github.com/YOUR-USERNAME/michelle-3d-portfolio/releases/download/v1.0.0-assets/portfolio-room.min.glb
```

### Step 7: Update Config
Open `src/blob-config.json` and add:
```json
{
  "sources": {
    "cloudflareR2": "https://pub-xxxxx.r2.dev/portfolio-room.min.glb",
    "githubRelease": "https://github.com/YOUR-USERNAME/michelle-3d-portfolio/releases/download/v1.0.0-assets/portfolio-room.min.glb",
    "vercelBlob": "https://ih4hmkjuh0idhrgl.public.blob.vercel-storage.com/portfolio-room.min.glb"
  },
  ...
}
```

### ✅ GitHub Releases Setup Complete!

**Benefits:**
- ✅ Unlimited storage
- ✅ Reliable GitHub CDN
- ✅ Version control for assets
- ✅ Free forever

---

## 🧪 Part 3: Testing Your Setup

### Test in Browser
1. Open DevTools (F12)
2. Go to Console tab
3. Refresh your portfolio
4. Look for: `Loading GLB from: cloudflareR2` (or whichever source works first)

### Expected Console Output
```
Device performance detected: high
Loading GLB from: cloudflareR2
```

Or if R2 is empty:
```
Device performance detected: high
Loading GLB from: githubRelease
```

Or if both are empty:
```
Device performance detected: high
Loading GLB from: vercelBlob
```

### Test Fallback Chain
To test the fallback:
1. Temporarily set `cloudflareR2` to an invalid URL
2. Refresh page
3. Should automatically fall back to GitHub Releases
4. Console will show: `Loading GLB from: githubRelease`

---

## 📝 Final Configuration Example

Your complete `src/blob-config.json` should look like:

```json
{
  "sources": {
    "cloudflareR2": "https://pub-abc123xyz.r2.dev/portfolio-room.min.glb",
    "githubRelease": "https://github.com/yourusername/michelle-3d-portfolio/releases/download/v1.0.0-assets/portfolio-room.min.glb",
    "vercelBlob": "https://ih4hmkjuh0idhrgl.public.blob.vercel-storage.com/portfolio-room.min.glb"
  },
  "fallbackOrder": ["cloudflareR2", "githubRelease", "vercelBlob", "local"],
  "uploadedAt": "2025-11-06T...",
  "notes": {
    "cloudflareR2": "Primary - 10GB free, unlimited bandwidth",
    "githubRelease": "Fallback - Unlimited storage, reliable CDN",
    "vercelBlob": "Current - 1GB limit, works well",
    "local": "Dev fallback - /portfolio-room.min.glb"
  }
}
```

---

## 🚀 Quick Start (Choose One)

### Option A: Just GitHub Releases (Easiest - 5 minutes)
If you want to get started quickly:
1. Follow **Part 2** only (GitHub Releases)
2. Update `githubRelease` in config
3. Done! ✅

### Option B: Full Setup (Best Performance - 15 minutes)
For optimal performance:
1. Follow **Part 1** (Cloudflare R2)
2. Follow **Part 2** (GitHub Releases) as backup
3. Test both
4. Done! ✅

---

## 💡 Pro Tips

### 1. Compress Before Upload
Your GLB is 200MB+. Compress it first:
```bash
# Install gltf-pipeline
npm install -g gltf-pipeline

# Compress your model (can reduce size by 50-90%)
gltf-pipeline -i public/portfolio-room.min.glb -o public/portfolio-room-compressed.glb -d
```

### 2. Custom Domain (Cloudflare R2)
For a professional URL:
1. In R2 bucket settings, click **Custom Domain**
2. Add your domain: `assets.yourportfolio.com`
3. Update DNS as instructed
4. URL becomes: `https://assets.yourportfolio.com/portfolio-room.min.glb`

### 3. Update All Locations
When you upload a new version:
1. Upload to Cloudflare R2
2. Create new GitHub Release (v1.0.1)
3. URLs automatically update (same path)

### 4. Monitor Usage
**Cloudflare R2:**
- Dashboard shows storage and bandwidth usage
- 10GB storage / month free
- Unlimited bandwidth

**GitHub Releases:**
- No usage limits
- Can host unlimited assets

---

## 🔧 Troubleshooting

### Issue: "Failed to load GLB"
**Solution:**
1. Check Console for error message
2. Verify URLs are correct (copy-paste exactly)
3. Check if files are publicly accessible
4. Try each URL directly in browser

### Issue: CORS Error
**Cloudflare R2:**
1. Go to R2 bucket settings
2. Add CORS policy:
```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET"],
    "AllowedHeaders": ["*"]
  }
]
```

**GitHub Releases:**
- CORS is automatically configured ✅

### Issue: Still using Vercel Blob
**Check:**
1. Are R2 and GitHub URLs filled in config?
2. Are they correct URLs?
3. Check Console: "Loading GLB from: ..."
4. Clear cache and refresh

---

## 📊 Cost Comparison

| Service | Storage | Bandwidth | Setup Time | Cost |
|---------|---------|-----------|------------|------|
| **Cloudflare R2** | 10GB | Unlimited | 10 min | FREE |
| **GitHub Releases** | Unlimited | Good | 5 min | FREE |
| **Vercel Blob** | 1GB | Limited | Already done | FREE |

---

## ✅ Checklist

After setup, verify:
- [ ] Cloudflare R2 bucket created
- [ ] GLB uploaded to R2
- [ ] R2 public URL obtained
- [ ] GitHub Release created
- [ ] GLB uploaded to Release
- [ ] Release asset URL obtained
- [ ] `blob-config.json` updated
- [ ] Console shows correct loading source
- [ ] Portfolio loads successfully
- [ ] Mobile performance is good

---

## 🎉 You're Done!

Your portfolio now has:
- ✅ **Triple redundancy** (3 sources + local)
- ✅ **Automatic fallback** (if one fails, tries next)
- ✅ **Best performance** (Cloudflare R2 CDN)
- ✅ **Unlimited storage** (GitHub Releases)
- ✅ **Zero cost** (all free tiers)

Your visitors will automatically get the fastest available source! 🚀

---

## 📞 Need Help?

**Check:**
1. Console logs for loading source
2. Network tab for failed requests
3. Verify URLs are publicly accessible

**Common Commands:**
```bash
# Test if URL is accessible
curl -I https://your-r2-url/portfolio-room.min.glb

# Build and deploy
npm run build
```

**Next Steps:**
- Compress your GLB file (save bandwidth)
- Add custom domain to R2 (optional)
- Monitor performance in production

