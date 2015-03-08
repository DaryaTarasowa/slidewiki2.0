module.exports = {
     loadLanguages: function(context){         
     context.service.read('deck.google_languages', {}, {}, function(err, res) {
          if (err) {
            context.dispatch('GOOGLE_LANGUAGES_FAILURE', err);
            return;
          }
          context.dispatch('GOOGLE_LANGUAGES_SUCCESS', {
            languages: res.languages
          });

        });       
    }
};


