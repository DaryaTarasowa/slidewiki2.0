module.exports = {
     loadLanguages: function(context, done){         
        context.service.read('deck.google_languages', {}, {}, function(err, res) {
          if (err) {
            context.dispatch('GOOGLE_LANGUAGES_FAILURE', err);
            done();
            return;
          }
          context.dispatch('GOOGLE_LANGUAGES_SUCCESS', {
            languages: res.languages
          });
          //null indicates no error
          
          done(null);
        });       
    }
}


