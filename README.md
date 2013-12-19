[![Build Status](https://secure.travis-ci.org/pirxpilot/grunt-mincer.png)](http://travis-ci.org/pirxpilot/grunt-mincer)
[![Dependency Status](https://gemnasium.com/pirxpilot/grunt-mincer.png)](https://gemnasium.com/pirxpilot/grunt-mincer)
[![NPM version](https://badge.fury.io/js/grunt-mincer.png)](http://badge.fury.io/js/grunt-mincer)

# grunt-mincer

Use [mincer] to concatenate your sources.

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-mincer`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-mincer');
```

[grunt]: https://github.com/gruntjs/grunt
[getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md
[mincer]: https://github.com/nodeca/mincer
[grunt_multi_task]: https://github.com/gruntjs/grunt/blob/master/docs/types_of_tasks.md

## Documentation

Mincer is a [multi task][grunt_multi_task], meaning that grunt will automatically iterate over all
`mince` targets if a target is not specified.

### Overview

Inside your `grunt.js` file, add a section named `mince`.

### Parameters

#### src ```string```

Name of the file to be processed by mincer. It probably contains one or more mincer `require`
directives. If source is not specified your target name with `.js` suffix will be used.

#### dest ```string```

Output file: this is where mincer is going to dump your concatenated sources.

#### destDir ```string```

If `dest` is not specified `destDir` and the name of your target are used to determine the name of
the output file: ```path.join(destDir, target + '.js')```

#### include ```string|array```

List of directories that are added to [mincer] load path. If you have only one directory it can be
specified as a single string.

#### helpers ```object```

Use to define helpers functions for EJS module. You can preprocess any resource with EJS as long as
you use `ejs` extension.

#### engines ```object```

Object with configuration options for each mincer engine.

#### configure ```function(mincer)```

Optional configure function that is called before before `compile` phase: allows for direct access to mincer object.

#### manifestPath ```string```

Path to `manifest.json` file that will be generated from assets. It will contain several attributes
for faster access to assets. Check out [mincer documentation](http://nodeca.github.io/mincer/#Manifest)
for more information about manifest usafe. If `manifestPath` is set assets are compiled into manifest
directory, `dest` and `destDir` parameters are ignored.

#### jsCompressor ```string|function(context, data)```

JavaScript compression function or predefined `mincer` js compressor identifier `"uglify"`. If predefined identifier is used - `uglify-js` package needs to be installed. Check out [mincer jsCompressor documentation](http://nodeca.github.io/mincer/#Compressing.prototype.jsCompressor) for more details.

#### cssCompressor ```string|function(context, data)```

CSS compression function or predefined `mincer` css compressor identifier `"csso"`. If predefined identifier is used - `csso` package needs to be installed. Check out [mincer cssCompressor documentation](http://nodeca.github.io/mincer/#Compressing.prototype.cssCompressor) for more details.

### Config Examples

There are couple of formats you can use to configure mincer task.

```javascript
'mince': {
  'main': {
    include: ['src', 'module/src'],
    src: 'main.js',
    dest: 'build/main.js'
  }
}
```

You can skip `src` if it has the same basename as your target:

```javascript
'mince': {
  'main': {
    include: ['src', 'module/src'],
    dest: 'build/main.js'
  }
}
```

You can specify `destDir` instead of `dest` if your output file has the same basename as your target:

```javascript
'mince': {
  'main': {
    include: ['src', 'module/src'],
    destDir: 'build'
  }
}
```

And if you only have one `include` directory you can specify it as string:

```javascript
'mince': {
  'main': {
    include: 'src',
    destDir: 'build'
  }
}
```

Manifest generation:

```javascript
'mince': {
  'main': {
	  manifestPath: 'build/manifest.json',
    include: 'src',
    src: 'application.js'
  }
}
```

You can use different format for each target.


You can configure Mincer engines: this configures `CoffeeEngine` to use `bare` compilation option,
and instructs `StylusEngine` to use `nib`.

```javascript
'mince': {
  'main': {
    include: 'src',
    destDir: 'build',
    engines: {
      'Coffee': { bare: true },
      'Stylus': function(stylus) {
        stylus.use(require('nib')());
      }
    }
  }
}
```

You can also define EJS helpers in your gruntfile:

```javascript
'mince': {
  'main': {
    include: 'src',
    src: 'main.js.ejs',
    destDir: 'build',
    helpers: {
      version: function() { return "3.2.1"; }
    }
  }
}
```

To access `Mincer` directly used `configure` option:

```javascript
'mince': {
  'main': {
    include: 'src',
    destDir: 'build',
    configure: function(mincer) {
      // call any mincer functions here
      mincer.logger.use({
        error: function(msg) {
          // set up special error logger
        }
      });
    }
  }
}
```


## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for
any new or changed functionality. Lint and test your code using [grunt][grunt].

## Release History

- grunt-mincer 0.2 is compatible with grunt 0.3
- grunt-mincer 0.3 and newer is compatible with grunt 0.4


See [History.md](History.md)

## License
Copyright (c) 2012 (pirxpilot) Damian Krzeminski
Licensed under the MIT license.
