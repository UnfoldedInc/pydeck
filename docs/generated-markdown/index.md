# Welcome to pydeck’s documentation!

If you have not already, [follow the installation instructions](https://github.com/uber/deck.gl/blob/master/bindings/pydeck/README.md)


* pydeck Layer Overview and Examples


    * Understanding keyword arguments in pydeck layers


    * The `type` positional argument


    * Expression parsers in pydeck objects


    * Passing string constants


    * Understanding get_position


* Example: Vancouver property values


* Deck


* Data utilities


    * Examples


* Configuring the pydeck tooltip


    * Templating syntax


    * Examples


* ViewState


* View


* LightSettings


## [Layers](layer.html)

Configure one of the many deck.gl layers for rendering in pydeck

## [Deck](deck.html)

Used to write data out to a widget in Jupyter, save it out to HTML, and
configure some global parameters of a visualization, like its size or
tooltip.

## [Data utilities](data_utils.html)

A handful of functions to make certain common data exercises easier,
like automatically fitting to data on a map or coloring categorical data.

## [ViewState](view_state.html)

Used to set the precise location of a user’s vantage point on the data, like
a user’s zoom level.

## [View](view.html)

Used to enable/disable map controls and also modify the kind of map projection,
like plotting in flat plane instead of plotting on a mercator projection.

## [LightSettings (Experimental)](light_settings.html)

Configure the lighting within a visualization.

## Caveats


* Please note that pydeck assumes Internet access. You will need an Internet connection or the visualization will not render.


* Currently, in its beta version **pydeck will NOT raise an error on incorrect or omitted layer arguments**.If nothing renders in your viewport, check your browser’s [developer console](https://javascript.info/devtools)or review the layer catalog. If you’re still stuck, file an issue by clicking [here](https://github.com/uber/deck.gl/issues/new?assignees=&labels=bug&template=bug-report.md&title=).# Indices and tables


* Index


* Module Index


* Search Page
