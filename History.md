
1.0.1 / 2015-09-09
==================

  * [TASK] Add support for mincer 1.3+
  * [TASK] Test against node 0.12
  * [TASK] Update license information / package.json

1.0.0 / 2015-02-04
==================

  * Fixes path seperator on windows.
  * Update supported mincer and source-map versions
  * Update development dependencies

1.0.0-rc1 / 2014-10-13
==================

 * [BUGFIX] Fix search paths in manifest mode

1.0.0-beta4 / 2014-07-29
==================

 * [FEATURE] Override sourceMappingURL with custom function
 * [BUGFIX] Adjust for Mincer 1.1.2 map format
 * [BUGFIX] Fix relative asset path handling

1.0.0-beta3 / 2014-07-25
==================

 * SourceMap support for dedicated files and manifest mode
 * Perform asset concatenation using SourceNode
 * Keep the subdirectory information when compiling a manifest
 * Access to the Mincer.Environment for helpers
 * Add `enable` option for custom configurations
 * Bump mincer dependency to 1.1
 * Test on node 0.10.x
 * Updated code examples

1.0.0-beta2 / 2014-03-26
==================

 * Strip known engine extensions from source list for manifests
 * Adjust test output for changes in mincer 1.0
 * Upgrade dependency to use mincer 1.0

1.0.0-beta / 2014-03-10
==================

 * Reworked the task configuration to conform to the Grunt configuring tasks guide.

0.6.0 / 2013-12-18
==================

 * Expose cssCompressor and jsCompressor functions of mincer

0.5.0 / 2013-12-18
==================

 * Added manifest.json generation (from vadimi)

0.4.1 / 2013-09-22
==================

 * Use `helpers` option to add helpers to environment (from awmckinley fork)

0.4.0 / 2013-09-22
==================

 * Add `engines` configuration
 * Update to mincer 0.5

0.3.3 / 2013-09-22
==================

 * Remove tests from npm package
 * Relax dependency requirements

0.3.2 / 2013-06-25
==================

 * Add ability to configure Mincer dynamically (for example to enable 'nib' in stylus engine)

0.3.1 / 2013-02-28
==================

 * Add peerDependencies for grunt 0.4.0
 * Markup fixes in README.md

0.3.0 / 2013-02-26
==================

 * Grunt 0.4 compatibility

0.2.0 / 2012-10-10
==================

  * Remove 'mince' helper for grunt 4.x compatibility
  * Add travis configuration

0.1.2 / 2012-10-09
==================

  * Add unit tests

0.1.1 / 2012-10-09
==================

  * Define and use 'mince' grunt helper
