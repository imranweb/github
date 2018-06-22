var GH = GH || {};

(function ($, ns, undefined) {
    if ($ === undefined) {
        console.log("jQuery not found");
        return false;
    }

    ns.init = function() {
      GRepo.init();
    };

    var form = $("#github-user-form");
    var dataContainer = $("#repositories");
    var usernameInput = $('#github-user');
    var repouri  = 'https://api.github.com/users/{username}/repos';
    var createIssueUri = 'https://api.github.com/repos/{owner}/{repo}/issues';
    var loader = $("#loader");
    var issueFormContainer = $( "#issue-form-container" );
    var createIssueSelectorClass = 'create-issue';
    var msgEle = issueFormContainer.find(".msg");

    var GITHUB_APP_KEY = 'B11a8xkp0WMxInG2Hivp6d8C-Pc';
    var provider = 'github';

    var GRepo = {
        init: function() {
            this.bindEvents();
            this.oAuthHandler = oAuthHandler.init(provider, GITHUB_APP_KEY);
        },

        bindEvents: function() {
            var _this = this;
            $(form).submit(function(e) {
                e.preventDefault();
                _this.getRepositories(usernameInput.val());
            });

            this.issueFormHandler();
        },

        getRepositories: function(username) {
            this.getGHRepoData(this.getRequestUri(username), this.renderRepoData.bind(this));
        },

        getGHRepoData: function (url, callback) {
            var _this = this;
            loader.show();
            dataContainer.html("");
            $.getJSON(url, function(json){
                callback.call(null, json); 
                loader.hide();               
            }).fail(function() {
                _this.onFailure();
                loader.hide(); 
            }); 
        },

        onFailure: function() {
            dataContainer.html("No repository found!");
        },

        renderRepoData: function(repositories) {
            if(repositories.length == 0) {
                this.onFailure();
                return;
            }

            var html = ' <ul class="list-group">';
            $.each(repositories, function(index) {
                html +=  '<li class="list-group-item"><h4 class"mb-1"><a href="'+repositories[index].html_url+'" target="_blank">'+repositories[index].name + '</a>  <button class="btn btn-warning pull-right create-issue" data-name='+repositories[index].name+'>Create Issue</button> </h4></li>';
            });
            html += '</ul>';
            dataContainer.html(html);
            this.addEventToCreateIssue();
            //console.log(repositories);
        },

        addEventToCreateIssue: function() {
            var _this = this;
            $("."+createIssueSelectorClass).on("click", function(e) {
                e.preventDefault();
               _this.createIssueHandler($(this));
              
            });
        },

        issueFormHandler: function(ele) {
            var _this = this;
            _this.dialog = issueFormContainer.dialog({
                autoOpen: false,
                height: 370,
                width: 750,
                modal: true,
                buttons: {
                  "Create Issue": function() {
                    _this.createIssue(_this.dialog.form.selectedEle);
                  },
                  Cancel: function() {
                    _this.dialog.dialog( "close" );
                  }
                },
                close: function() {
                    _this.dialog.form [ 0 ].reset();
                    msgEle.html("");
                }
            });

            _this.dialog.form = issueFormContainer.find( "form" ).on( "submit", function( event ) {
                event.preventDefault();
                _this.createIssue(_this.dialog.form.selectedEle);
            });
        },

        createIssue: function(ele) {
            var url = createIssueUri.replace('{owner}', usernameInput.val()).replace('{repo}', ele.data('name'));
            var formData = JSON.stringify({title: this.dialog.form.get(0).title.value, body: this.dialog.form.get(0).body.value});
            var _this = this;
            $.ajax({
               type: "POST",
               headers: {"Authorization": "token " + this.oAuthHandler.accessToken},
               /*beforeSend: function(xhr) {
                 xhr.setRequestHeader("Authorization", "token " + _this.oAuthHandler.accessToken);
                },*/
                url: url,
                data: formData,
                success: function() {
                    _this.afterCreatIssueSuccess();
                },
              });
        },

        afterCreatIssueSuccess: function() {
            var _this = this;
            msgEle.html("Issue create Successfull!");
            setTimeout(function() {
                _this.dialog.dialog("close");
            }, 2000);
        },

        createIssueHandler: function(ele) {
            this.oAuthHandler.authorize(this.showIssueForm.bind(this), ele);
        },

        showIssueForm: function(ele) {
            issueFormContainer.find("[data-type=repo-title]").html(ele.data('name'));
            this.dialog.dialog( "open" );
            this.dialog.form.selectedEle = ele;
        },

        getRequestUri: function(username) {
            return repouri.replace('{username}', username);
        }
    };

    var oAuthHandler = {
        accessToken: null,

        init: function(provider, APP_KEY) {
            OAuth.initialize(APP_KEY);
            this.provider = provider;
            return this;
        },

        authorize: function(callback, ele) {
            //Using popup (option 1)
            var _this = this;
            OAuth.popup(this.provider, {cache: true})
            .done(function(result) {
                console.log(result);
                _this.accessToken = result.access_token;
                callback(ele);
                // do some stuff with result
            })
            .fail(function (err) {
                console.log("fail");
            //handle error with err
            });
        }

    };

    ns.init();

})(window.jQuery, GH);
