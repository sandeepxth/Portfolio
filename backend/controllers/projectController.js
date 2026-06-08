const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving projects' });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving project' });
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private (Admin only)
exports.createProject = async (req, res) => {
  try {
    const { title, description, techStack, features, image, githubUrl, liveUrl, order } = req.body;

    const project = await Project.create({
      title,
      description,
      techStack,
      features,
      image,
      githubUrl,
      liveUrl,
      order: order || 0,
    });

    res.status(201).json({ success: true, data: project, message: 'Project created successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error creating project' });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin only)
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const { title, description, techStack, features, image, githubUrl, liveUrl, order } = req.body;

    project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        techStack,
        features,
        image,
        githubUrl,
        liveUrl,
        order: order !== undefined ? order : project.order,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: project, message: 'Project updated successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating project' });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await project.deleteOne();

    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting project' });
  }
};
