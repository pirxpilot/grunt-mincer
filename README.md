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

Inside your `grunt.js` file, add a section named `mince`. Task targets, files and options may be
specified according to the grunt Configuring tasks guide.

### Options

#### include ```string|array```

List of directories that are added to [mincer] load path. If you have only one directory it can be
specified as a single string.

#### enable ```string|array```

List of configurations like `autoprefixer` or `source_maps` that should be enabled in [mincer]'s environment.

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
for more information about manifest usage. If `manifestPath` is set assets are compiled into this
directory, the destination information in the files configuration will be ignored.

#### jsCompressor ```string|function(context, data)```

JavaScript compression function or predefined `mincer` js compressor identifier `"uglify"`. If predefined identifier is used - `uglify-js` package needs to be installed. Check out [mincer jsCompressor documentation](http://nodeca.github.io/mincer/#Compressing.prototype.jsCompressor) for more details.

#### cssCompressor ```string|function(context, data)```

CSS compression function or predefined `mincer` css compressor identifier `"csso"`. If predefined identifier is used - `csso` package needs to be installed. Check out [mincer cssCompressor documentation](http://nodeca.github.io/mincer/#Compressing.prototype.cssCompressor) for more details.

#### sourceMappingBaseURL ```string```

The base url to use when referencing source-maps in compiled assets. Defaults to `""` if not explicitly set.

#### sourceMappingURL ```function(options, file)```

Optional function that is called to determine the sourceMappingURL for a file. Has access to the grunt task options as well as the file object for current asset. By default returns the destination filename prefixed with the `sourceMappingBaseURL`

### Files

The files on which the task operates can be defined using all the powerful options provided by Grunt.
See the [Configuring tasks guide](http://gruntjs.com/configuring-tasks#files) for details on the different
ways to configure the file sets.

### Config Examples

There are couple of formats you can use to configure mincer task.

```javascript
mince: {
  main: {
    options: {
      include: ["src", "module/src"]
    },
    files: [{
      src: "main.js",
      dest: "build/main.js"
    }]
  }
}
```

You can compile multiple assets into one output file:

```javascript
mince: {
  main: {
    options: {
      include: ["src", "module/src"]
    },
    files: [{
      src: ["main.js", "extra.js"],
      dest: "build/main.js"
    }]
  }
}
```

You can dynamically build the file mapping:

```javascript
mince: {
  main: {
    options: {
      include: ["src", "module/src"]
    },
    files: [
      {
        cwd: "javascripts",
        src: ["**/*.coffee", "**/*.js", "!**/index.js"],
        dest: "build/main.js",
        expand: true
      }
    ]
  }
}
```

And if you only have one `include` directory you can specify it as string:

```javascript
mince: {
  main: {
    options: {
      include: "src"
    }
  }
}
```

Manifest generation:

```javascript
mince: {
  main: {
    options: {
      include: ["src", "module/src"],
      manifestPath: "build/manifest.json",
      manifestOptions: {
        compress: false,
        sourceMaps: false,
        embedMappingComments: false
      }
    },
    files: [
      {
        src: ["**/*.coffee", "**/*.js", "**/*.scss"],
        dest: "build/"
      }
    ]
  }
}
```

By setting the `manifestPath` you enable compiling and writing the assets to the given directory. The
assets will be written to fingerprinted files. Optionally you can specify `manifestOptions`. This object
will be passed through to mincer unmodified. See the [mincer documentation][manifest_options] for supported options.
The defaults are to disable compression and source maps.

[manifest_options]: http://nodeca.github.io/mincer/#Manifest.prototype.compile

You can use a different format for each target.

You can configure Mincer engines: this configures `CoffeeEngine` to use `bare` compilation option,
and instructs `StylusEngine` to use `nib`.

```javascript
mince: {
  main: {
    options: {
      include: "src",
      engines: {
        Coffee: {
          bare: true
        },
        Stylus: function(stylus) {
          stylus.use(require("nib")());
        }
      }
    },
    files: [{
      src: "main.js",
      dest: "build/main.js"
    }]
  }
}
```

You can also define EJS helpers in your gruntfile:

```javascript
mince: {
  main: {
    options: {
      include: "src",
      helpers: {
        version: function() {
          return "3.2.1";
        }
      }
    },
    files: [{
      src: "main.js.ejs",
      dest: "build/main.js"
    }]
  }
}
```

To access `Mincer` directly used `configure` option:

```javascript
mince: {
  main: {
    options: {
      include: "src",
      configure: function(mincer) {
        mincer.logger.use({
          error: function(msg) {}
        });
      }
    },
    files: [{
      src: "main.js.ejs",
      dest: "build/main.js"
    }]
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
