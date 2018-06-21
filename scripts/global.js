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

    var GRepo = {
        init: function() {
            this.bindEvents();
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
                _this.showIssueForm($(this));
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
                  form[ 0 ].reset();
                }
            });

            _this.dialog.form = issueFormContainer.find( "form" ).on( "submit", function( event ) {
                event.preventDefault();
                _this.createIssue(_this.dialog.form.selectedEle);
            });
        },

        createIssue: function(ele) {
            var url = createIssueUri.replace('{owner}', usernameInput.val()).replace('{repo}', ele.data('name'));
            /*$.post( url, {title: "fdff", body: "ffff"})
            .done(function( data ) {
                alert( "Data Loaded: " + data );
            });*/

            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify({title: "fdff", body: "ffff"})
                //success: success,
                //dataType: dataType
              });
           // console.log("creating...");

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

    ns.init();

})(window.jQuery, GH);
