md-deck
=========

I love reveal.js but having to build HTML each time is bulky and not easily portable.

I wanted something simpler, so I built this, where you have a series of markdown "sections" in a single markdown file, so you can quickly make a presentation that looks good and is functional, and is highly compatible with automated output.

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

npm install -g md-deck

Usage
-----

Simple usage is just `deck s <markdown-file>` (alternatively `md-deck`)

You can also view a preview of your deck on the commandline with `deck cat <markdown-file>`

For more advanced examples check out the help using: `deck --help`

Roadmap
-------

    - pluggable styles (using an existing idiom)
    - more modes + modes docs
    - exporting
