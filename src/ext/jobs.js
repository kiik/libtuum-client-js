
var Tuum = (function(nsp) {

  var TuumJobMod = Class.Extend({
    init: function(dev) {
      this._dev = dev;

      this.activeJob = null;

      this.Classes = [{clsName:'AgronautSoilSampler'}];
      this.jobData = {};

      this.m_refreshActiveJobFlag = true;
      this.m_loadJobDataFlag = false;

      this._dev.addHook('active-job', function(ev, cb) {
        if(this.Job.activeJob != null) cb(ev, this.Job.activeJob);
      });

      var that = this;
      this._proc = setInterval(function() {
        that.process();
      }, 1000);
    },

    getDemoData: function() {
      return new Promise(function(fulfill, reject) {
        $.ajax({
          url: '/assets/agronaut-test.4.json'
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
      if(typeof(jobId) == undefined) return;

      var that = this;
      var dev = this._dev;

      return new Promise(function(fulfill, reject) {
        dev.comm.getJobConf(jobId).then(function(data) {
          that.jobData[jobId] = data; //TODO: Cleanup

          dev.emit('job-conf', data);
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

    getStatus: function() {
      var dev = this._dev;
      var that = this;
      return new Promise(function(fulfill, reject) {
        dev.comm.jobStatus().then(function(data) {
          if(!data.job) return fulfill({res: 0, job: null});

          dev.Job.activeJob = data.job;
          dev.Job.activeCtx = data.ctx;

          dev.emit('active-job-ctx', data.ctx);
          fulfill(data);
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
    },

    process: function() {
      var that = this;

      if(this.activeJob != null) {
        if(this.m_refreshActiveJobFlag) {
          this.m_refreshActiveJobFlag = false;
          //this.getStatus().finally(function() {that.m_refreshActiveJobFlag = true;console.log(that.activeJob)});
        }
      }
    },


    loadJobData: function(jobId) {
      var dev = this._dev;
      var that = this;
      return new Promise(function(fulfill, reject) {
        dev.Job.getConf(jobId).then(function(data) {
          if(data.res <= 0) return reject(data);
          if(!data.job) return reject(data);

          that.jobData[jobId] = data.job;
          fulfill(data.job);
        }, reject);
      });
    },
    loadActiveJob: function() {
      var dev = this._dev;
      var that = this;
      return new Promise(function(fulfill, reject) {
        that.getStatus().then(function(data) {
          if(data.res == 0)
            return fulfill({res: 0, job: null});

          that.loadJobData(data.job.id).then(function(job) {
            that.activeJob = job;
            dev.emit('active-job', data);
            fulfill(data);
          }, reject);
        }, reject);
      });
    },

    projectToMap: function(job, tuumMap) {
      tuumMap.$.polygon('agro-field', job.conf.area);
      tuumMap.$.nodes('agro-soil-samples', job.conf.targets);
      tuumMap.$.path('agro-path', job.conf.targets);
    },
    projectTarget: function(jobId, tuumMap) {
      var that = this;
      var pId = this.activeCtx.pSeq;

      if(jobId in this.jobData) {
        var t = this.jobData[jobId].conf.targets[pId];
        var p = [this._dev.data.gps, {lat: t[0], lng: t[1]}];
        tuumMap.$.drawTargetVector('nav-target#'+jobId, p);
      } else {
        this.loadJobData(jobId).then(function() {
          that.projectTarget(jobId, tuumMap);
        });
      }
    }

  });

  Tuum.RegisterExtension('TuumJobMod', function(target) {
    return new TuumJobMod(target);
  });

  return nsp;
})(Tuum || {});
