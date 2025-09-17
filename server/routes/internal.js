const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { body, param, query, validationResult } = require('express-validator');
const router = express.Router();

const supabaseService = require('../services/supabaseService');
const authMiddleware = require('../middleware/auth');
const { responses, utils, validators, AppError } = require('../utils/helpers');

// Multer configuration for screenshot uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/screenshots');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'screenshot-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Nur Bilder sind erlaubt (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// ===================================================
// TEAM MEMBERS ROUTES
// ===================================================

// Get all team members
router.get('/team-members', authMiddleware, utils.asyncHandler(async (req, res) => {
  utils.logRequest(req, { action: 'get_team_members' });

  try {
    const { data, error } = await supabaseService.supabase
      .from('team_members')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;

    return res.json(responses.success(data, 'Team-Mitglieder erfolgreich geladen'));
  } catch (error) {
    console.error('Error loading team members:', error);
    return res.status(500).json(responses.error('Fehler beim Laden der Team-Mitglieder', 'DATABASE_ERROR'));
  }
}));

// Get team member by email
router.get('/team-members/by-email/:email', authMiddleware, utils.asyncHandler(async (req, res) => {
  const { email } = req.params;

  if (!validators.isValidEmail(email)) {
    return res.status(400).json(responses.error('Ungültige E-Mail-Adresse', 'INVALID_EMAIL'));
  }

  try {
    const { data, error } = await supabaseService.supabase
      .from('team_members')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return res.status(404).json(responses.notFound('Team-Mitglied'));
    }

    return res.json(responses.success(data, 'Team-Mitglied gefunden'));
  } catch (error) {
    console.error('Error finding team member:', error);
    return res.status(500).json(responses.error('Fehler beim Suchen des Team-Mitglieds', 'DATABASE_ERROR'));
  }
}));

// ===================================================
// SCREEN TEMPLATES ROUTES
// ===================================================

// Get all screen templates
router.get('/screen-templates', authMiddleware, utils.asyncHandler(async (req, res) => {
  const { platform } = req.query;
  
  utils.logRequest(req, { action: 'get_screen_templates', platform });

  try {
    let query = supabaseService.supabase
      .from('screen_templates')
      .select('*')
      .eq('is_active', true)
      .order('platform, section, screen_name');

    if (platform && ['mobile', 'web'].includes(platform)) {
      query = query.eq('platform', platform);
    }

    const { data, error } = await query;

    if (error) throw error;

    return res.json(responses.success(data, 'Screen-Templates erfolgreich geladen'));
  } catch (error) {
    console.error('Error loading screen templates:', error);
    return res.status(500).json(responses.error('Fehler beim Laden der Screen-Templates', 'DATABASE_ERROR'));
  }
}));

// ===================================================
// INTERNAL FEEDBACK ROUTES
// ===================================================

// Get all internal feedback
router.get('/feedback', authMiddleware, utils.asyncHandler(async (req, res) => {
  const { 
    platform, 
    status, 
    severity, 
    assigned_to, 
    created_by,
    limit = 50,
    offset = 0
  } = req.query;

  utils.logRequest(req, { action: 'get_internal_feedback', filters: { platform, status, severity } });

  try {
    let query = supabaseService.supabase
      .from('internal_feedback')
      .select(`
        *,
        created_by_member:team_members!internal_feedback_created_by_fkey(id, name, email, role),
        assigned_to_member:team_members!internal_feedback_assigned_to_fkey(id, name, email, role)
      `)
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    // Apply filters
    if (platform && ['mobile', 'web'].includes(platform)) {
      query = query.eq('platform', platform);
    }
    if (status && ['open', 'in_progress', 'fixed', 'verified', 'closed'].includes(status)) {
      query = query.eq('status', status);
    }
    if (severity && ['critical', 'high', 'medium', 'low'].includes(severity)) {
      query = query.eq('severity', severity);
    }
    if (assigned_to) {
      query = query.eq('assigned_to', assigned_to);
    }
    if (created_by) {
      query = query.eq('created_by', created_by);
    }

    const { data, error } = await query;

    if (error) throw error;

    return res.json(responses.success(data, 'Internes Feedback erfolgreich geladen'));
  } catch (error) {
    console.error('Error loading internal feedback:', error);
    return res.status(500).json(responses.error('Fehler beim Laden des internen Feedbacks', 'DATABASE_ERROR'));
  }
}));

// Get specific internal feedback by ID
router.get('/feedback/:id', authMiddleware, utils.asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json(responses.error('Ungültige Feedback-ID', 'INVALID_ID'));
  }

  try {
    const { data, error } = await supabaseService.supabase
      .from('internal_feedback')
      .select(`
        *,
        created_by_member:team_members!internal_feedback_created_by_fkey(id, name, email, role),
        assigned_to_member:team_members!internal_feedback_assigned_to_fkey(id, name, email, role)
      `)
      .eq('id', parseInt(id))
      .single();

    if (error || !data) {
      return res.status(404).json(responses.notFound('Feedback'));
    }

    return res.json(responses.success(data, 'Feedback erfolgreich geladen'));
  } catch (error) {
    console.error('Error loading feedback:', error);
    return res.status(500).json(responses.error('Fehler beim Laden des Feedbacks', 'DATABASE_ERROR'));
  }
}));

// Create new internal feedback
router.post('/feedback', [
  authMiddleware,
  upload.single('screenshot'),
  body('screen_name').notEmpty().withMessage('Screen-Name ist erforderlich'),
  body('platform').isIn(['mobile', 'web']).withMessage('Platform muss mobile oder web sein'),
  body('title').notEmpty().withMessage('Titel ist erforderlich'),
  body('category').optional().isIn(['bug', 'ui', 'performance', 'feature', 'improvement']),
  body('severity').optional().isIn(['critical', 'high', 'medium', 'low']),
  body('description').optional()
], utils.asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(responses.validationError(errors.array()));
  }

  const {
    screen_name,
    screen_id,
    platform,
    category = 'bug',
    severity = 'medium',
    title,
    description,
    assigned_to,
    browser_info,
    device_info
  } = req.body;

  utils.logRequest(req, { action: 'create_internal_feedback', screen_name, platform });

  try {
    // Get current user from token
    const userEmail = req.user.email;
    
    // Find team member by email
    const { data: teamMember, error: teamError } = await supabaseService.supabase
      .from('team_members')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (teamError || !teamMember) {
      return res.status(403).json(responses.error('Team-Mitglied nicht gefunden', 'UNAUTHORIZED'));
    }

    // Prepare feedback data
    const feedbackData = {
      screen_name: utils.sanitizeText(screen_name),
      screen_id: screen_id ? utils.sanitizeText(screen_id) : null,
      platform,
      category,
      severity,
      title: utils.sanitizeText(title),
      description: description ? utils.sanitizeText(description) : null,
      created_by: teamMember.id,
      assigned_to: assigned_to || null,
      browser_info: browser_info ? JSON.parse(browser_info) : null,
      device_info: device_info ? JSON.parse(device_info) : null
    };

    // Handle screenshot upload
    if (req.file) {
      feedbackData.screenshot_url = `/uploads/screenshots/${req.file.filename}`;
      feedbackData.screenshot_filename = req.file.filename;
    }

    // Insert feedback
    const { data, error } = await supabaseService.supabase
      .from('internal_feedback')
      .insert([feedbackData])
      .select(`
        *,
        created_by_member:team_members!internal_feedback_created_by_fkey(id, name, email, role),
        assigned_to_member:team_members!internal_feedback_assigned_to_fkey(id, name, email, role)
      `)
      .single();

    if (error) throw error;

    return res.status(201).json(responses.success(data, 'Internes Feedback erfolgreich erstellt'));
  } catch (error) {
    console.error('Error creating internal feedback:', error);
    return res.status(500).json(responses.error('Fehler beim Erstellen des internen Feedbacks', 'DATABASE_ERROR'));
  }
}));

// Update internal feedback
router.put('/feedback/:id', [
  authMiddleware,
  body('status').optional().isIn(['open', 'in_progress', 'fixed', 'verified', 'closed']),
  body('severity').optional().isIn(['critical', 'high', 'medium', 'low']),
  body('assigned_to').optional()
], utils.asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(responses.validationError(errors.array()));
  }

  const { id } = req.params;
  const { status, severity, assigned_to, title, description } = req.body;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json(responses.error('Ungültige Feedback-ID', 'INVALID_ID'));
  }

  try {
    const updateData = {};
    if (status) updateData.status = status;
    if (severity) updateData.severity = severity;
    if (assigned_to !== undefined) updateData.assigned_to = assigned_to;
    if (title) updateData.title = utils.sanitizeText(title);
    if (description !== undefined) updateData.description = description ? utils.sanitizeText(description) : null;

    const { data, error } = await supabaseService.supabase
      .from('internal_feedback')
      .update(updateData)
      .eq('id', parseInt(id))
      .select(`
        *,
        created_by_member:team_members!internal_feedback_created_by_fkey(id, name, email, role),
        assigned_to_member:team_members!internal_feedback_assigned_to_fkey(id, name, email, role)
      `)
      .single();

    if (error) throw error;

    return res.json(responses.success(data, 'Feedback erfolgreich aktualisiert'));
  } catch (error) {
    console.error('Error updating feedback:', error);
    return res.status(500).json(responses.error('Fehler beim Aktualisieren des Feedbacks', 'DATABASE_ERROR'));
  }
}));

// ===================================================
// COMMENTS ROUTES
// ===================================================

// Get comments for specific feedback
router.get('/feedback/:id/comments', authMiddleware, utils.asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json(responses.error('Ungültige Feedback-ID', 'INVALID_ID'));
  }

  try {
    const { data, error } = await supabaseService.supabase
      .from('internal_feedback_comments')
      .select(`
        *,
        author:team_members!internal_feedback_comments_author_id_fkey(id, name, email, role)
      `)
      .eq('feedback_id', parseInt(id))
      .order('created_at', { ascending: true });

    if (error) throw error;

    return res.json(responses.success(data, 'Kommentare erfolgreich geladen'));
  } catch (error) {
    console.error('Error loading comments:', error);
    return res.status(500).json(responses.error('Fehler beim Laden der Kommentare', 'DATABASE_ERROR'));
  }
}));

// Add comment to feedback
router.post('/feedback/:id/comments', [
  authMiddleware,
  body('comment_text').notEmpty().withMessage('Kommentar-Text ist erforderlich')
], utils.asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(responses.validationError(errors.array()));
  }

  const { id } = req.params;
  const { comment_text, is_status_change = false, old_status, new_status } = req.body;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json(responses.error('Ungültige Feedback-ID', 'INVALID_ID'));
  }

  try {
    // Get current user
    const userEmail = req.user.email;
    
    const { data: teamMember, error: teamError } = await supabaseService.supabase
      .from('team_members')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (teamError || !teamMember) {
      return res.status(403).json(responses.error('Team-Mitglied nicht gefunden', 'UNAUTHORIZED'));
    }

    // Insert comment
    const { data, error } = await supabaseService.supabase
      .from('internal_feedback_comments')
      .insert([{
        feedback_id: parseInt(id),
        comment_text: utils.sanitizeText(comment_text),
        author_id: teamMember.id,
        is_status_change,
        old_status: old_status || null,
        new_status: new_status || null
      }])
      .select(`
        *,
        author:team_members!internal_feedback_comments_author_id_fkey(id, name, email, role)
      `)
      .single();

    if (error) throw error;

    return res.status(201).json(responses.success(data, 'Kommentar erfolgreich hinzugefügt'));
  } catch (error) {
    console.error('Error adding comment:', error);
    return res.status(500).json(responses.error('Fehler beim Hinzufügen des Kommentars', 'DATABASE_ERROR'));
  }
}));

// ===================================================
// STATISTICS ROUTES
// ===================================================

// Get internal feedback statistics
router.get('/stats', authMiddleware, utils.asyncHandler(async (req, res) => {
  utils.logRequest(req, { action: 'get_internal_stats' });

  try {
    // Get overall stats
    const { data: allFeedback, error: feedbackError } = await supabaseService.supabase
      .from('internal_feedback')
      .select('platform, status, severity, created_at');

    if (feedbackError) throw feedbackError;

    const stats = {
      total: allFeedback.length,
      by_platform: {
        mobile: allFeedback.filter(f => f.platform === 'mobile').length,
        web: allFeedback.filter(f => f.platform === 'web').length
      },
      by_status: {
        open: allFeedback.filter(f => f.status === 'open').length,
        in_progress: allFeedback.filter(f => f.status === 'in_progress').length,
        fixed: allFeedback.filter(f => f.status === 'fixed').length,
        verified: allFeedback.filter(f => f.status === 'verified').length,
        closed: allFeedback.filter(f => f.status === 'closed').length
      },
      by_severity: {
        critical: allFeedback.filter(f => f.severity === 'critical').length,
        high: allFeedback.filter(f => f.severity === 'high').length,
        medium: allFeedback.filter(f => f.severity === 'medium').length,
        low: allFeedback.filter(f => f.severity === 'low').length
      }
    };

    return res.json(responses.success(stats, 'Statistiken erfolgreich geladen'));
  } catch (error) {
    console.error('Error loading stats:', error);
    return res.status(500).json(responses.error('Fehler beim Laden der Statistiken', 'DATABASE_ERROR'));
  }
}));

module.exports = router;
