const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/authMiddleware');
const {
  uploadAndAnalyzeResume,
  getReportById,
  getReportsHistory,
  deleteReport
} = require('../controllers/resumeController');

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer disk storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File validation filter - PDF only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || path.extname(file.originalname).toLowerCase() === '.pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF documents are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// POST upload resume and trigger analysis
router.post('/upload', protect, upload.single('resume'), uploadAndAnalyzeResume);

// GET historical list of user's reports
router.get('/history', protect, getReportsHistory);

// GET a specific report details
router.get('/report/:id', protect, getReportById);

// DELETE a specific report
router.delete('/report/:id', protect, deleteReport);

module.exports = router;
