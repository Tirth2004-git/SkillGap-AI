const fs = require('fs');
const pdfParse = require('pdf-parse');
const Report = require('../models/Report');
const { analyzeResumeWithGemini } = require('../utils/gemini');

// @desc    Upload resume PDF and generate analysis
// @route   POST /api/resume/upload
// @access  Private
const uploadAndAnalyzeResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a PDF resume' });
  }

  const { role } = req.body;
  if (!role) {
    // Delete uploaded file if target role is missing
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({ message: 'Please specify a target job role' });
  }

  try {
    // Read the uploaded file buffer
    const dataBuffer = fs.readFileSync(req.file.path);
    
    // Parse the PDF text
    const parsedPdf = await pdfParse(dataBuffer);
    const resumeText = parsedPdf.text;

    if (!resumeText || resumeText.trim().length === 0) {
      throw new Error('Could not extract readable text from the uploaded PDF.');
    }

    // Call Gemini API to analyze the resume text against the target role
    const analysisResult = await analyzeResumeWithGemini(resumeText, role);

    // Save report to database
    const newReport = await Report.create({
      userId: req.user.id,
      role: role,
      atsScore: analysisResult.atsScore,
      missingSkills: analysisResult.missingSkills,
      strongSkills: analysisResult.strongSkills,
      suggestions: analysisResult.suggestions,
      roadmap: analysisResult.roadmap,
      recommendedCourses: analysisResult.recommendedCourses,
      summary: analysisResult.summary,
    });

    res.status(201).json(newReport);
  } catch (error) {
    console.error('Resume upload/analysis error:', error);
    res.status(500).json({ 
      message: 'Failed to analyze resume. Please try again.',
      error: error.message 
    });
  } finally {
    // Always clean up the uploaded temporary file
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Failed to delete temp file:', err);
      }
    }
  }
};

// @desc    Get a single report by ID
// @route   GET /api/resume/report/:id
// @access  Private
const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if the report belongs to the logged-in user
    if (report.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to view this report' });
    }

    res.json(report);
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ message: 'Server error retrieving report' });
  }
};

// @desc    Get all reports for the logged-in user (History)
// @route   GET /api/resume/history
// @access  Private
const getReportsHistory = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user.id })
      .select('role atsScore createdAt summary')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Server error retrieving history' });
  }
};

// @desc    Delete a report
// @route   DELETE /api/resume/report/:id
// @access  Private
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (report.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await report.deleteOne();
    res.json({ message: 'Report removed' });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ message: 'Server error removing report' });
  }
};

module.exports = {
  uploadAndAnalyzeResume,
  getReportById,
  getReportsHistory,
  deleteReport
};
