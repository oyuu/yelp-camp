var Campground = require('./models/campground');
var Comment = require('./models/comment');
var User = require('./models/user');

var data = [
  {
    name: 'Canopy Tribes, Johor',
    image: 'https://static.tripzilla.com/thumb/3/6/37942_700x.jpg',
    description:
      "Comfort level: Glitz and glamour - Located in a rainforest a mere 3km away from the waterfall area of Kota Tinggi is the luxurious glamping site known as Canopy Tribes. Offering a near-perfect mixture of modern day comforts and the splendour of being at one with nature, this establishment offers fully furnished bell tent accommodation and a charcoal BBQ grill. Because let's face it, no camping trip – whether it’s glamping or otherwise – is ever complete without a hearty BBQ dinner under the stars!"
  },
  {
    name: 'Hibiscus Beach Resort, Sabah',
    image: 'https://static.tripzilla.com/thumb/3/7/37943_700x.jpg',
    description:
      "Comfort level: Like an island vacation - Over in East Malaysia, perched on the northern tip of Sabah and situated strategically by the shoreline is the Hibiscus Beach Retreat. It is a boutique beach chalet which offers visitors a mesmerising view of the South China Sea. You can also engage in activities like jungle trekking, scuba diving and mangrove touring apart from the usual camping activities. if you're truly looking to just leave behind your daily life for a weekend, then this is one glamping choice not to be missed."
  },
  {
    name: 'Endau-Rompin National Park, Pahang/Johor',
    image: 'https://static.tripzilla.com/thumb/3/8/37944_700x.jpg',
    description:
      "Comfort level: Basic survival training - Endau Rompin National Park is the second largest tropical rainforest reserve in Malaysia. It is situated between the states of Pahang and Johor and is a popular spot for bird-watching, fishing and camping. The campsite is accessible by 4WD and basic sanitary and dining facilities are provided but that's about as good as it gets in terms of modern-day conveniences. The park is also home to some endangered species in Malaysia, such as the Sumatran Rhinos and elephants. Because of that, it is recommended that you hire a guide at the park headquarters in case things go awry while you're trekking/camping."
  }
];

function seedDB() {
  User.deleteMany({}, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('all users removed!');
      Comment.deleteMany({}, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('all comments removed!');
          Campground.deleteMany({}, function(err) {
            if (err) {
              console.log(err);
            } else {
              console.log('all campgrounds removed!');
              data.forEach(function(seed) {
                Campground.create(seed, function(err, createdCampground) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log('Created new campground');
                    Comment.create(
                      {
                        text: 'testesteste',
                        author: 'Amirul'
                      },
                      function(err, createdComment) {
                        if (err) {
                          console.log(err);
                        } else {
                          createdCampground.comments.push(createdComment);
                          createdCampground.save();
                          console.log('Created new comment');
                        }
                      }
                    );
                  }
                });
              });
            }
          });
        }
      });
    }
  });
}

module.exports = seedDB;
