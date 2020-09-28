const Vacancy = require("../models/vacancyModel");
const AdvancedFeatures = require("../util/advancedFeatures");
const catchAsync = require('../util/catchAsync');

exports.createVacancy = catchAsync(async(req, res) => {
  if(req.user.role === 'recruiter') {
    req.body.contactEmail = req.user.email;
    req.body.organization = req.user.organization;
  }
  const vacancy = await Vacancy.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      vacancy
    }
  })
})

exports.getAllVacancy = catchAsync(async(req, res) => {
  const features = new AdvancedFeatures(Vacancy.find(), req.query).filter().sort().limitingFields().paginate();
  const vacancies = await features.query;
  res.status(200).json({
    status: 'success',
    results: vacancies.length,
    data: {
      vacancies
    }
  });
})

exports.getVancancy = catchAsync(async(req, res) => {
  const vacancy = await Vacancy.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      vacancy
    }
  });
})

// by Admin, recruiter
exports.updateVacancy = catchAsync(async(req, res) => {
  const updatedVacancy = await Vacancy.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    data: {
      vacancy: updatedVacancy
    }
  });
})

// by Admin, recruiter
exports.deleteVacancy = catchAsync(async(req, res) => {
  const deletedVacancy = await Vacancy.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: {
      deletedVacancy
    }
  });
})