const storage = require('./storage');

storage.put('First', 'FirstPlayer');
storage.put('Second', 'SecondPlayer');
storage.update('First', 'ThirdPlayer');
storage.delete('Second');
storage.save();
storage.load();
console.log(storage.getAll());
storage.put('last', 'LastPlayer');
storage.save();
storage.load();
console.log(storage.getAll());
