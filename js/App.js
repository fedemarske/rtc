var app = angular.module('RtcApp', ['ngMaterial']);

app.controller("RtcController", function($scope,$log){
    var self = this;

    self.videos = false;
    self.loginSuccess = false;
    self.videoOut = false;
    self.talk = false;
    self.video_2 = null;

    self.login = function() {
        var user_name = self.username || "Anonymous";
        var phone = window.phone = PHONE({
            number        : user_name, // listen on username line else Anonymous
            publish_key   : 'pub-c-2dd69866-318e-4ea4-84fa-b38d7fe74c8d',
            subscribe_key : 'sub-c-ebfc8486-a8db-11e5-bd8c-0619f8945a4f',
            datachannels  : true,  // Enable Data Channels
        });
        phone.ready(function(){
            $scope.$apply(function(){
                self.loginSuccess = true;
                self.videos = true;
            })
        });
        phone.receive(function(session){
            session.connected(function(session) {
                $scope.$apply(function(){
                    self.videoOut = true;
                    session.video.id = "video_2";
                    self.video_2 = session.video;
                    $log.log(session.video)
                });
            });
            session.ended(function(session) {
                video_out.innerHTML='';
                self.talk = false;
            });
        });
        phone.message(function(session, message) {
            console.log(message)
            if(message.data){
                console.log(session.video)
                video_out.appendChild(session.video);
            }else{
                video_out.innerHTML='';
            }
        } );
        return false;
    }

    self.makeCall = function(){
        self.videoOut = true;
        phone.dial(self.number);
    }

    self.pushToTalk = function(){
        self.talk = true;
        window.phone.send({data: 1 });
        video_in.appendChild(phone.video);
    }

    self.end = function(){
        if (!window.phone) return;
        window.phone.send({data: 0 });
        video_in.innerHTML='';
        self.talk = false;
    }

    self.endConnection = function(){
        window.phone.hangup();
        self.videoOut = false;
    }
});
