const Vacancy = require('../models/vacancyModel');
const Response = require('../models/responseModel');
const User = require('../models/userModel');

const catchAsync = require('../util/catchAsync');
const AdvancedFeatures = require('../util/advancedFeatures');

exports.getOverview = (req, res) => {
  res.status(200).render('overview');
}

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    heading: 'Log into your account',
    category: 'For Students and Companies',
    category_subtitle: '',
  });
}

exports.getSignUpForm = (req, res) => {
  let category = '', category_subtitle = '';
  const role = req.params.role;
  if(role === 'candidate') {
    category = 'For Students',
    category_subtitle = 'Practice , Grab internship, Gain experience'
  } else {
    category = 'For Companies and Recruiters'
    category_subtitle = 'Hire With Us'
  }
  res.status(200).render('signup', {
    heading: 'SignUp',
    role,
    category,
    category_subtitle
  });
}

exports.getUserHome = catchAsync(async (req, res) => {
  const features = new AdvancedFeatures(Vacancy.find(), '').sort();
  const vacancies = await features.query;
  let pageBtn = vacancies.length / 5;
  if(vacancies.length % 5)
    pageBtn++;
  res.status(200).render('userHome', {
    vacancies,
    limit: 5,
    pageBtn
  });
})

exports.getUserAbout = catchAsync(async (req, res) => {
  let renderPage = '', responses, vacancies = [];
  if(req.user.role === 'recruiter') {
    renderPage = 'companyAbout';
    let users = await User.findById(req.user._id);
    users = await users.populate('response').execPopulate();
    responses = users.response;
    vacancies = await Vacancy.find({ contactEmail: req.user.email });
  }
  else if(req.user.role === 'candidate') {
    renderPage = 'userAbout';
    responses = await Response.find({ user: req.user._id });
  }
  
  let content = req.params.content;
  if(!content)
    content = 'personal';
  const limit = 5;
  let pageBtn_Res = responses.length / limit;
  if(responses.length % limit)
    pageBtn_Res++;

  let pageBtn_Vac = (vacancies.length / limit) || 0;
  if(vacancies.length % limit)
    pageBtn_Vac++;
  res.status(200).render(renderPage, {
    content,
    responses,
    vacancies,
    pageBtn_Res,
    pageBtn_Vac,
    limit
  });
})

exports.getVacancyAbout = catchAsync(async (req, res) => {
  const vacancy = await Vacancy.find({ jobID: req.params.jobID });
  const responses = await Response.find({ user: req.user._id });
  let disabled = false;
  responses.forEach(el => {
    if(el.vacancy.jobID == req.params.jobID) {
      disabled = true;
    }
  })
  res.locals.vacancy = vacancy;
  res.status(200).render('vacancyAbout', {
    vacancy: vacancy[0],
    disabled
  });
})

//Update user info and Render user info with updated user
exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    email: req.body.email,
    organization: req.body.organization
  },
  {
    new: true,
    runValidators: true
  });
  let renderPage = '', responses = [];
  if(req.user.role === 'recruiter') {
    renderPage = 'companyAbout';
    let res = await Response.find();
    res.forEach(el => {
      if(el.vacancy.contactEmail == req.user.email)
        responses.push(el);
    })
  }
  else if(req.user.role === 'candidate') {
    renderPage = 'userAbout';
    responses = await Response.find({ user: req.user._id });
  }
  
  let content = req.params.content;
  if(!content)
    content = 'personal';
  const limit = 5;
  let pageBtn = responses.length / limit;
  if(responses.length % limit)
    pageBtn++;

  res.locals.user = updatedUser;
  res.status(200).render('userAbout', {

  })
  next();
});

// Confirm Email
exports.confirmEmail = catchAsync(async (req, res, next) => {
  res.status(200).render('error', {
    title: 'Verify your email',
    msg: 'Please verify your email address by clicking on the link sent to your email address.'
  })
})