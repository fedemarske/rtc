var app = angular.module('RtcApp', ['ngMaterial']);

app.controller("RtcController", function($scope){
    var self = this;

    self.videos = false;
    self.loginSuccess = false;
    self.videoOut = false;

    self.login = function() {
        var user_name = self.username || "Anonymous";
        var phone = window.phone = PHONE({
            number        : user_name, // listen on username line else Anonymous
            publish_key   : 'pub-c-2dd69866-318e-4ea4-84fa-b38d7fe74c8d',
            subscribe_key : 'sub-c-ebfc8486-a8db-11e5-bd8c-0619f8945a4f',
            datachannels  : true,  // Enable Data Channels
        });
        phone.ready(function(){
            console.log("todo piola");
            $scope.$apply(function(){
                self.loginSuccess = true;
                self.videos = true;
                video_in.appendChild(phone.video);
            })
        });
        phone.receive(function(session){
            session.connected(function(session) {
                video_out.appendChild(session.video);
                self.videoOut = true;
            });
            session.ended(function(session) {
                video_out.innerHTML='';
                form_block.className = "input-field col s4";
            });
        });
        return false;
    }
});
