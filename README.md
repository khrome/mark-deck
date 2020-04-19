mark-deck
=========
Simple markdown presentation generation and display, without boilerplate reveal.js or having some weird structural solution with symlinks. Just execute the file from anywhere, standalone.

Each slide consists of a separator with a mode(and eventually options)
followed by a markdown section of slide content.

Something like:

    ---------------------------{mode}-
    # markdown

    - a list!
        - details
        - information

Installation
------------

npm install -g mark-deck

Usage
-----

Simple usage is just `deck <markdown-file>` alternatively `mark-deck`

You can also view a preview of your deck on the commandline with `deck cat <markdown-file>`

For more advanced examples check out the help using: `deck --help`

Roadmap
-------

    - pluggable styles (using an existing idiom)
    - more modes + modes docs
    - exporting
