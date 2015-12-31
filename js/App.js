var app = angular.module('RtcApp', ['ngMaterial']);

app.controller("RtcController", function($scope,$log){
    var self = this;

    self.videos = false;
    self.loginSuccess = false;
    self.videoOut = false;
    self.talk = false;
    self.video_2 = null;
    self.theOther = null;

    self.login = function() {
        var user_name = self.username || "Anonymous";
        var phone = window.phone = PHONE({
            number        : user_name, // listen on username line else Anonymous
            publish_key   : 'pub-c-2dd69866-318e-4ea4-84fa-b38d7fe74c8d',
            subscribe_key : 'sub-c-ebfc8486-a8db-11e5-bd8c-0619f8945a4f',
            datachannels  : true,  // Enable Data Channels
            ssl: true
        });
        phone.ready(function(){
            $scope.$apply(function(){
                self.loginSuccess = true;
                self.videos = true;
                phone.stopAudio();
            })
        });
        phone.receive(function(session){
            session.connected(function(session) {
                $scope.$apply(function(){
                    self.videoOut = true;
                    session.stopAudio();
                    $log.log(session)
                    self.theOther = session;
                });
            });
            session.ended(function(session) {
                video_out.innerHTML='';
                self.talk = false;
                self.videoOut = false;
            });
        });
        phone.message(function(session, message) {
            console.log(message)
            if(message.data){
                if(phone.number() !== session.number){
                    session.video.style.display = "block";
                    session.video.id = "video_out";
                    video_out.appendChild(session.video);
                    //session.resumeAudio();
                }
            }else{
                document.getElementById("video_out").style.display = "none";
                //session.stopAudio();
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
        console.log(self.theOther)
        self.theOther.send({data: 1 });
        phone.video.style.display = "block";
        phone.video.id = "video_in";
        phone.video.setAttribute("muted", "");
        video_in.appendChild(phone.video);
    }

    self.end = function(){
        if (!window.phone) return;
        self.theOther.send({data: 0 });
        document.getElementById("video_in").style.display = "none";
        self.talk = false;
    }

    self.endConnection = function(){
        window.phone.hangup();
        self.videoOut = false;
    }
});
