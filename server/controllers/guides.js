const models = require('../../db/models');

module.exports.createGuide = (req, res) => {
  models.User.where({facebook_id: req.body.facebookId}).fetch({columns: ['id']})
  .then(result => {
    if (!result) {
      models.Guide.forge({user_id: result.id})
      .save()
      .then(result => {
        console.log('success creating guide!!');
        res.status(200).send();
      });
    } else {
      console.log('guide already exists!');
      res.status(200).send();
    }  
  })
  .error(err => {
    res.status(500).send(err);
  })
  .catch((err) => {
    console.log('Error creating a guide.', err);
    res.sendStatus(404);
  });
};

module.exports.getOneGuide = (req, res) => {
  models.Guide.where({id: req.params.id})
  .fetch({
    withRelated: [
      {
        'user': function(qb) {
          qb.select();
        }
      },
      {
        'guideSpecialties.specialty': function(qb) {
          qb.select();
        }
      }
    ]
  })
  .then(profile => {
    if (!profile) {
      throw profile;
    }
    res.status(200).send(profile);
  })
  .error(err => {
    res.status(500).send(err);
  })
  .catch(() => {
    res.sendStatus(404);
  });
};

module.exports.getGuideByChat = (req, res) => {
  console.log('req.params in getGuideByChat method', req.params);
  models.Guide.where({id: req.params.id})
  .fetch()
  .then(profile => {
    if (!profile) {
      throw profile;
    }
    res.status(200).send(profile);
  })
  .error(err => {
    res.status(500).send(err);
  })
  .catch(() => {
    res.sendStatus(404);
  });
};

module.exports.getGuideByUserId = (req, res) => {
  console.log('req.params in getGuideByUserId method', req.params);
  models.User.where({facebook_id: req.params.facebookId})
  .fetch()
  .then(profile => {
    console.log(profile.attributes.id);
    models.Guide.where({user_id: profile.attributes.id}).fetch({columns: ['id']})
    .then(guideInfo => {
      console.log(guideInfo);
      res.status(200).send(guideInfo);
    });
  })
  .error(err => {
    res.status(500).send(err);
  })
  .catch(() => {
    res.sendStatus(404);
  });
};

module.exports.getSearchResults = (req, res) => {
  console.log('guides get search results', req.params);
  models.Guide.query((qb) => {
    qb.limit(25);
  })
  //.where({})
  .fetchAll({
    withRelated: [
      {
        'user': function(qb) {
          qb.select();
        }
      },
      {
        'availabilities': function(qb) {
   
          qb.where('date', req.params.date).andWhere('city', req.params.city);
          // qb.where('date', '2017-11-11');
        }
      },
      {
        'guideSpecialties.specialty': function(qb) {
          qb.select();
        }
      }
    ],
  })
  .then(profiles => {
    if (!profiles) {
      throw profiles;
    }
    res.status(200).send(profiles);
  })
  .error(err => {
    res.status(500).send(err);
  })
  .catch((error) => {
    res.sendStatus(404);
    console.log('error getting search results.', error);
  });
};

// user.where({
//     id: 43
//   }).fetchAll({
//     withRelated: ['feed.userRelated', 'feed.activityTypes']
//   }).then(function(data) {
//     data = data.toJSON();
//     res.send(data);
//   });
