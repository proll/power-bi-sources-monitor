var cheerio = require('cheerio');
var request = require('request');
var _ = require("lodash");

var assets = require("./assets");

var assetsListSource = assets.assetsList;

function collect_all_data(callback) {
    var assetsList = _.cloneDeep(assetsListSource);
    var processedAssets = 0;
    assetsList.forEach( (assetIn, indexIn) => {
        var asset = assetIn;
        var index = indexIn;
        asset.reviews = [];
        // send request  to get other pages items
        // https://store.office.com/reviews.aspx?rs=en-US&ad=US&ui=en-US
        //
        // HEADERS 
        // content-type: application/x-www-form-urlencoded
        // referer: https://store.office.com/en-us/app.aspx?assetid=WA104380777
        //
        //  PAYLOAD
        //  assetid=WA104380777&page=1&order=0&direction=0&skip=true
        var formData = {
            assetid: asset.assetId,
            visual: asset.Visual,
            page: 0,
            order:0,
            direction:0,
            skip:true
        };
        var headers = {
            'content-type': 'application/x-www-form-urlencoded',
            'referer': `https://store.office.com/en-us/app.aspx?assetid=${formData.assetId}`
        };

        getReviews();
        
        function getComments(asset, callback) {

            request(`https://store.office.com/asyncreviews?assetid=${asset.assetId}`,
            function(error, response, body) {
                processedAssets++;
                if (response.statusCode != 200) {
                    return;
                }

                if (!body) {
                    return;
                }

                // process each page
                try {
                    var jsonData = JSON.parse(body);
                    var comments = jsonData.LatestComments;
                    
                    comments.forEach( reviewComments => {
                        asset.reviews.forEach(review => {
                            if (review.reviewid.trim() === reviewComments.ReviewId.trim()) {
                                review.comments = review.comments || [];
                                review.comments = review.comments.concat(reviewComments.Comments.Values);
                            }
                        })
                    });
                }
                catch(exception) {
                }

                //console.log(processedAssets);
                if (processedAssets == assetsList.length && callback) {
                    callback(assetsList);
                }                
            });
        }
        
        function getReviews(page = 0) {
            formDataInternal = _.cloneDeep(formData);
            formDataInternal.page = page;             
            request(`https://store.office.com/reviews.aspx?rs=en-US&ad=US&ui=en-US`, {
                    method: "POST",
                    headers: headers,
                    form: formDataInternal
                },
                function(error, response, body) {
                    if (response.statusCode != 200) {
                        // todo write to log
                        return;
                    }

                    if (!body) {
                        getComments(asset, callback);
                        return;
                    }

                    // todo process each page
                    try {
                        var jsonData = JSON.parse(body);
                        var html = jsonData.Items
                            .replace(/href="(.*?)"/g, "")
                            .replace(/data-helpfulliveidsigninurl="(.*?)"/g, "")
                            .replace(/data-nothelpfulliveidsigninurl="(.*?)"/g, "")
                            .replace(/data-helpfulvoteurl="(.*?)"/g, "")
                            .replace(/data-nothelpfulvoteurl="(.*?)"/g, "")                                
                            ; //
                        const $ = cheerio.load(html);
                        const $links = cheerio.load(jsonData.Link);
                        var pagination = $links(".oxPaginationLink").contents().text().match(/\d+/g);
                        var itemsFrom = +pagination[0];
                        var itemsTo = +pagination[1];
                        var totalItems = +pagination[2];

                        if (totalItems > itemsTo) {
                            pages = Math.ceil(totalItems / itemsTo);

                        }

                        var reviews = $("#ReviewsExternal");
                        var reviewList = reviews.find(".oxReview");
                        for (var reviewIndex = itemsFrom - 1; reviewIndex < itemsTo; reviewIndex++ ) {
                            var review = reviewList[reviewIndex];
                            var base = reviews.find(`#Review${reviewIndex}-Base`);
                            var reviewid = base[0].attribs["data-reviewid"];
                            var reviewTitleText =reviews.find(`#Review${reviewIndex}-Title`).contents().text();
                            var reviewBodyText =reviews.find(`#Review${reviewIndex}-Body`).contents().text();
                            var reviewDate = new Date(reviews.find(`#Review${reviewIndex}-Date`).contents().text());
                            var reviewAuthor =reviews.find(`#Review${reviewIndex}-Author`).contents().text();

                            //Passed time 
                            var passedTime = "hours";
                            var dateDiff = (new Date() - reviewDate) / 1000 / 60 / 60;

                            if (dateDiff > 24) {
                                passedTime = "days"
                                dateDiff = dateDiff / 24;
                            }

                            if (dateDiff > 7 && dateDiff < 31) {
                                passedTime = "weeks"
                                dateDiff = dateDiff / 7;
                            }

                            if (dateDiff > 31) {
                                passedTime = "month"
                                dateDiff = dateDiff / 31;
                            }

                            if (dateDiff > 12) {
                                passedTime = "years"
                                dateDiff = dateDiff / 12;
                            }
                            
                            asset.reviews.push({
                                reviewid: reviewid,
                                title: reviewTitleText,
                                body: reviewBodyText,
                                date: reviewDate,
                                author: reviewAuthor,
                                assetid: asset.assetId,
                                visual: asset.Visual,
                                dateDiff: dateDiff,
                                passedTime: passedTime
                            });
                        }
                        
                        // TODO check pages count
                    }
                    catch (exception) {
                        processedAssets++;
                        //console.log("asset not processed");
                        return;
                    }

                    if (itemsFrom < totalItems) {
                        //console.log(`getReviews ${asset.Visual} ${page} ${itemsFrom} ${totalItems}`);
                        getReviews(++page);
                    } else {
                        //console.log("getComments " + asset.Visual);
                        getComments(asset, callback);
                    }
                });
            }
        }
    );
}

function collect_uncommented_reviews(callback) {
    collect_all_data((reviews)=> {
        reviews.forEach(function(asset) {
          asset.noCommentsReview = asset.reviews.some(rev => {
            if (rev.comments === undefined) {
              return true;
            }
    
            return false;
          });
    
          asset.earlyDate = (_.minBy(asset.reviews.filter((rev) => rev.comments === undefined),"date")|| {date: null}).date;
          asset.reviews = _.sortBy(asset.reviews, "date");
        }, this);
    
        reviews = _.sortBy(reviews, "earlyDate");
    
        try {
          response.render('pages/comments', {
            reviews: reviews
          });
        }
        catch(exception) {
          console.log(exception);
        }

        callback(reviews);
      });
}

function get_office_store_visuals(callback) {
    request(`https://store.office.com/api/addins/search?ad=US&productgroup=PowerBI&orderby=Desc&orderfield=None&qu=&rs=en-US&skiptoitem=0&top=1000&ui=en-US`,
    function(error, response, body) {
        if (response.statusCode != 200) {
            return;
        }

        if (!body) {
            return;
        }

        callback(body);
    });
}

module.exports.collect_all_data = collect_all_data;
module.exports.collect_uncommented_reviews = collect_uncommented_reviews;
module.exports.get_office_store_visuals = get_office_store_visuals;