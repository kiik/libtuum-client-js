

var Tuum = (function(nsp) {

  var tuumExtFactoryMap = {};

  Tuum.RegisterExtension = function(ext_name, factory_fn) {
    tuumExtFactoryMap[ext_name] = factory_fn;
  }

  Tuum.FindExtension = function(ext_name) {
    //TODO: raise exception if not found
    if(!(ext_name in tuumExtFactoryMap)) {
      return (function() { return {}; });
    }

    return tuumExtFactoryMap[ext_name];
  }

  return nsp;
})(Tuum || {});
