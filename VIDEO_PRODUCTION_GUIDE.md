# Alaska Pay - Video Production Quick Start Guide

## 🎬 Record Your App Store Preview Video in 1 Hour

### Prerequisites
- iPhone 15 Pro Max (or simulator)
- Mac with QuickTime Player or screen recording software
- USB microphone (optional but recommended)
- iMovie or DaVinci Resolve (free)

---

## Step 1: Prepare Your Device (10 minutes)

### iPhone Setup
```bash
# Enable screen recording
Settings > Control Center > Screen Recording (add)

# Disable notifications
Settings > Focus > Do Not Disturb (enable)

# Set to full brightness
Settings > Display & Brightness > Brightness (max)

# Disable Auto-Lock
Settings > Display & Brightness > Auto-Lock > Never

# Clear badges and notifications
```

### Simulator Setup (Alternative)
```bash
# Open iOS Simulator
open -a Simulator

# Select iPhone 15 Pro Max
Hardware > Device > iPhone 15 Pro Max

# Start recording
xcrun simctl io booted recordVideo --codec=h264 preview.mp4
```

---

## Step 2: Record Screen (15 minutes)

### Recording Checklist
- [ ] Clean home screen (remove unnecessary apps)
- [ ] Full battery indicator
- [ ] Strong WiFi signal
- [ ] Time set to 9:41 AM (Apple standard)
- [ ] Carrier name visible

### Scene-by-Scene Recording

**Scene 1: Dashboard (Record 10 seconds, use 6)**
1. Open Alaska Pay app
2. Let dashboard load completely
3. Pause for 3 seconds
4. Tap around to show interactivity
5. Record 3 times for best take

**Scene 2: Send Money (Record 15 seconds, use 6)**
1. Tap "Send Money"
2. Select contact "Sarah Johnson"
3. Enter amount: $150.00
4. Add note: "Lunch money 🍕"
5. Authenticate with Face ID
6. Show success animation

**Scene 3: Virtual Cards (Record 12 seconds, use 6)**
1. Return to dashboard
2. Tap "Cards"
3. Swipe through card carousel
4. Tap to flip card
5. Toggle freeze/unfreeze
6. Show card details

**Scene 4: Bill Payment (Record 15 seconds, use 6)**
1. Navigate to "Pay Bills"
2. Select "Electricity" category
3. Choose saved biller
4. Enter amount: $85.50
5. Confirm payment
6. Show receipt

**Scene 5: Transaction History (Record 12 seconds, use 6)**
1. Open transaction history
2. Scroll through transactions
3. Tap on one transaction
4. Show detail view
5. Close detail
6. Return to dashboard

---

## Step 3: Record Voiceover (10 minutes)

### Voiceover Script (Read slowly and clearly)

```
[0:00-0:06]
Meet Alaska Pay - your complete digital wallet solution.

[0:06-0:12]
Send money instantly to friends and family with just a tap.

[0:12-0:18]
Create virtual cards for secure online shopping and subscriptions.

[0:18-0:24]
Pay all your bills in one place - electricity, water, internet, and more.

[0:24-0:30]
Track every transaction with detailed history and insights. Download Alaska Pay today!
```

### Recording Tips
- Record in quiet room
- Speak 10% slower than normal
- Smile while speaking (it affects tone)
- Record 3 takes, pick best
- Leave 1 second silence at start/end

### Recording Methods

**Option 1: QuickTime (Mac)**
```bash
File > New Audio Recording > Record
```

**Option 2: Voice Memos (iPhone)**
- Open Voice Memos app
- Tap record
- Save as "AlaskaPay_Voiceover.m4a"

**Option 3: Audacity (Free, All Platforms)**
- Download from audacityteam.org
- Select microphone
- Click record
- Export as MP3

---

## Step 4: Edit Video (20 minutes)

### iMovie (Mac - Free)

**Import Footage**
1. Open iMovie
2. Create New Project > Movie
3. Import all screen recordings
4. Import voiceover audio
5. Import background music (optional)

**Edit Timeline**
1. Drag clips to timeline in order
2. Trim each clip to exact duration:
   - Scene 1: 6 seconds
   - Scene 2: 6 seconds
   - Scene 3: 6 seconds
   - Scene 4: 6 seconds
   - Scene 5: 6 seconds
3. Add transitions between scenes (0.5s dissolve)

**Add Voiceover**
1. Drag voiceover to audio track
2. Align with video clips
3. Adjust volume to -12dB

**Add Text Overlays**
1. Click "Titles" in toolbar
2. Select "Lower Third" style
3. Add text at timestamps:
   - "Alaska Pay" (0:00-0:02)
   - "Instant Transfers" (0:08-0:10)
   - "Virtual Cards" (0:14-0:16)
   - "Easy Bill Payments" (0:20-0:22)
   - "Complete Transaction History" (0:24-0:26)
   - "Download Now" (0:28-0:30)

**Add Background Music (Optional)**
1. Click "Audio" in toolbar
2. Select "Soundtracks"
3. Choose upbeat track
4. Adjust volume to -24dB (background)

**Export Video**
1. File > Share > File
2. Resolution: 1080p
3. Quality: High
4. Format: H.264
5. Save as "AlaskaPay_AppPreview_30s.mp4"

---

### DaVinci Resolve (Free, Professional)

**Setup Project**
```
1. New Project > "Alaska Pay Preview"
2. Project Settings:
   - Timeline Resolution: 1080x1920
   - Timeline Frame Rate: 30 fps
3. Import media files
```

**Edit Page**
1. Drag clips to timeline
2. Trim to exact durations
3. Add transitions (Effects Library > Video Transitions)
4. Add text overlays (Effects Library > Titles)

**Fairlight Page (Audio)**
1. Adjust voiceover levels
2. Add background music
3. Apply audio ducking (music lowers when voice plays)
4. Add sound effects

**Color Page**
1. Apply color correction
2. Increase saturation by 10%
3. Boost highlights slightly
4. Add subtle vignette

**Deliver Page**
1. Format: MP4
2. Codec: H.264
3. Resolution: 1080x1920
4. Frame Rate: 30 fps
5. Quality: High
6. Render

---

## Step 5: Add Finishing Touches (5 minutes)

### Text Overlays (Canva - Free)

Create text graphics:
1. Go to canva.com
2. Custom size: 1080x1920
3. Create text overlays:
   - "Alaska Pay" logo
   - "Download Now" CTA
   - Feature callouts
4. Export as PNG with transparency
5. Import into video editor

### Sound Effects (Free Resources)

Download from:
- **Freesound.org**: UI sounds, clicks, swooshes
- **Zapsplat.com**: Success sounds, notifications
- **YouTube Audio Library**: Background music

Recommended sounds:
- Button tap: "UI_Click_01.wav"
- Success: "Success_Chime.wav"
- Transition: "Whoosh_01.wav"

---

## Step 6: Final Export & Upload

### Export Settings (Final)
```
Format: MP4
Codec: H.264
Resolution: 1080x1920 (9:16)
Frame Rate: 30 fps
Bit Rate: 10 Mbps
Audio: AAC, 256 kbps, Stereo
File Size: Under 500MB
Duration: Exactly 30 seconds
```

### Quality Check
- [ ] Video plays smoothly (no stuttering)
- [ ] Audio is clear (no clipping or distortion)
- [ ] Text is readable on mobile screen
- [ ] Colors are vibrant but not oversaturated
- [ ] Transitions are smooth
- [ ] Duration is exactly 30 seconds
- [ ] File size under 500MB

### Upload to App Store Connect

1. Go to appstoreconnect.apple.com
2. Select Alaska Pay app
3. Navigate to version
4. Click "App Preview and Screenshots"
5. Select "iPhone 15 Pro Max"
6. Upload video file
7. Select poster frame (best looking frame)
8. Preview on device
9. Save changes

---

## Quick Troubleshooting

### Video Quality Issues
- **Problem**: Blurry video
- **Solution**: Export at 1080p minimum, use H.264 codec

### Audio Sync Issues
- **Problem**: Voice doesn't match video
- **Solution**: Align audio waveform with visual cues in editor

### File Size Too Large
- **Problem**: Over 500MB
- **Solution**: Reduce bit rate to 8 Mbps, compress audio to 192 kbps

### Video Rejected by App Store
- **Problem**: Doesn't meet requirements
- **Solution**: Check aspect ratio (9:16), duration (30s max), format (MP4/MOV)

---

## Time-Saving Tips

1. **Use Templates**: Create reusable text overlay templates
2. **Batch Record**: Record all scenes in one session
3. **Use Presets**: Save export settings as preset
4. **Keyboard Shortcuts**: Learn editor shortcuts (speeds up 50%)
5. **Test Early**: Upload draft version to test compatibility

---

## Professional Upgrade Options

### Hire a Pro ($500-2000)
- **Fiverr**: Find video editors for $50-500
- **Upwork**: Professional editors $500-2000
- **99designs**: Video contests starting at $299

### What Pros Provide
- Professional voiceover talent
- Advanced motion graphics
- Color grading
- Sound design
- Multiple revisions
- Fast turnaround (3-5 days)

---

## Alternative: AI-Generated Video

### Tools to Try
1. **Descript**: AI voiceover + video editing
2. **Synthesia**: AI avatar presenter
3. **Pictory**: Text-to-video conversion
4. **InVideo**: Template-based creation

### Pros
- Fast (1-2 hours)
- Consistent quality
- Easy to update

### Cons
- Less authentic
- Monthly subscription required
- Limited customization

---

## Success Checklist

Before uploading to App Store:
- [ ] Video is exactly 30 seconds
- [ ] Resolution is 1080x1920 (9:16)
- [ ] File size under 500MB
- [ ] Audio is clear and balanced
- [ ] All text is readable
- [ ] Transitions are smooth
- [ ] Shows key app features
- [ ] Includes clear CTA
- [ ] Tested on actual device
- [ ] No copyrighted content

---

## Next Steps After Upload

1. **Monitor Performance**
   - Check App Store Connect analytics
   - Track video view rate
   - Monitor conversion rate

2. **A/B Test**
   - Create alternative version
   - Test different CTAs
   - Compare performance

3. **Update Regularly**
   - Refresh every 6 months
   - Add new features
   - Update for new iOS versions

4. **Localize**
   - Create versions in other languages
   - Adapt for different markets
   - Test regional performance

---

## Resources

### Free Tools
- **iMovie** (Mac): Video editing
- **DaVinci Resolve**: Professional editing
- **Audacity**: Audio recording/editing
- **Canva**: Graphics and text overlays
- **Freesound.org**: Sound effects

### Paid Tools (Optional)
- **Final Cut Pro** ($299): Professional editing
- **Adobe Premiere Pro** ($20.99/mo): Industry standard
- **Motion** ($49.99): Motion graphics
- **Compressor** ($49.99): Video compression

### Learning Resources
- **YouTube**: iMovie tutorials
- **LinkedIn Learning**: Video production courses
- **Apple Support**: App Store preview guidelines
- **WWDC Videos**: App marketing best practices

---

## Contact & Support

Questions? Check:
- APP_PREVIEW_VIDEO_STORYBOARD.md (detailed storyboard)
- APP_STORE_SCREENSHOTS_FINAL.md (screenshot guide)
- AUTO_DEPLOY_IOS_APPSTORE.md (deployment guide)

Good luck with your video production! 🎬
