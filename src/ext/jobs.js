
var Tuum = (function(nsp) {

  var TuumJobMod = Class.Extend({
    init: function(dev) {
      this._dev = dev;

      this.Classes = [{clsName:'AgronautSoilSampler'}];
    },

    getDemoData: function() {
      return new Promise(function(fulfill, reject) {
        $.ajax({
          url: '/assets/agronaut-test.json'
        }).done(function(data) {
          fulfill(data);
          //that.createDemoJob(data);
        });
      });
    },

    create: function(job, data) {
      var that = this._dev;
      return new Promise(function(fulfill, reject) {
        that.comm.createJob(job.clsName, job.name, data).then(function(data) {
          if(data.res <= 0) { // If implementation not available
            reject(data);
          } else {
            fulfill(data);
          }
        }, reject);
      });
    },

    getConf: function(jobId) {
      var that = this._dev;
      return new Promise(function(fulfill, reject) {
        that.comm.getJobConf(jobId).then(function(data) {
          fulfill(data);
        }, reject);
      });
    },

    configure: function(jobId, data) {
      var that = this._dev;;
      return new Promise(function(fulfill, reject) {
        that.comm.configureJob(jobId, data).then(function(data) {
          if(data.res <= 0) { // If job not ready
            reject(data);
          } else {
            fulfill(data);
          }
        }, reject);
      });
    },

    getStatus: function(jobId) {
      var that = this._dev;
      return new Promise(function(fulfill, reject) {
        that.comm.getJobStatus().then(function(data) {
          var buf = {};
          buf.job = data.job;
          buf.job.status = data.st;
          buf.job.ctx = data.ctx;
          fulfill(buf);
        }, reject);
      });
    },

    begin: function(jobId) {
      var that = this._dev;
      return new Promise(function(fulfill, reject) {
        that.comm.startJob(jobId).then(function(data) {
          if(data.res <= 0) { // If encountered error
            reject(data);
          } else {
            fulfill(data);
          }
        }, reject);
      });
    },

    list: function() {
      return this._dev.comm.getJobList();
    },

    createDemo: function(agronaut_data) {
      var that = this._dev;
      var job_name = null;

      for(var ix in agronaut_data.features) {
        var d = agronaut_data.features[ix];

        if(d.type != "Feature") continue;
        if(d.properties["agro-type"] == "field") {
          job_name = d.properties["agro-field-name"];
          break;
        }
      }

      if(job_name == null) return;
    }

  });

  Tuum.RegisterExtension('TuumJobMod', function(target) {
    return new TuumJobMod(target);
  });

  return nsp;
})(Tuum || {});
