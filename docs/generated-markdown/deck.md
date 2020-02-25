# Deck


### class pydeck.bindings.deck.Deck(layers=[], views=[{"@@type": "MapView", "controller": true}], map_style='mapbox://styles/mapbox/dark-v9', mapbox_key=None, initial_view_state=None, width='100%', height=500, tooltip=True, description=None, effects=None)
This is the renderer and configuration for a deck.gl visualization, similar to the
[Deck](https://deck.gl/#/documentation/deckgl-api-reference/deck) class from deck.gl.
Pass Deck a Mapbox API token to display a basemap; see the notes below.


* **Parameters**

    
    * **layers** (*pydeck.Layer** or **list of pydeck.Layer**, **default** [**]*) – List of `pydeck.bindings.layer.Layer` layers to render.


    * **views** (*list of pydeck.View**, **[**]*) – List of `pydeck.bindings.view.View` objects to render.


    * **map_style** (*str**, **default 'mapbox://styles/mapbox/dark-v9'*) – URI for Mapbox basemap style. See Mapbox’s [gallery](https://www.mapbox.com/gallery/) for examples.
    If not using a basemap, you can set this value to to an empty string, ‘’.


    * **initial_view_state** (*pydeck.ViewState**, **default None*) – Initial camera angle relative to the map, defaults to a fully zoomed out 0, 0-centered map
    To compute a viewport from data, see `pydeck.data_utils.viewport_helpers.compute_view()`


    * **mapbox_key** (*str**, **default None*) – Read on initialization from the MAPBOX_API_KEY environment variable. Defaults to None if not set.
    See your Mapbox
    [dashboard](https://docs.mapbox.com/help/how-mapbox-works/access-tokens/#mapbox-account-dashboard)
    to get an API token.
    If not using a basemap, you can set this value to ‘’.


    * **height** (*int**, **default 500*) – Height of Jupyter notebook cell, in pixels.


    * **width** (*int\`** or **string**, **default '100%'*) – Width of visualization, in pixels (if a number) or as a CSS value string.


    * **tooltip** (*bool** or **dict of {str: str}**, **default True*) – If `True`/`False`, toggles a default tooltip on visualization hover.
    Layers must have `pickable=True` set in order to display a tooltip.
    For more advanced usage, the user can pass a dict to configure more custom tooltip features.
    Documentation on this is available [in the hosted pydeck documentation](tooltip.html).



#### show()
Display current Deck object for a Jupyter notebook


#### to_html(filename=None, open_browser=False, notebook_display=True, iframe_width=700, iframe_height=500, \*\*kwargs)
Write a file and loads it to an iframe, if in a Jupyter environment;
otherwise, write a file and optionally open it in a web browser


* **Parameters**

    
    * **filename** (*str**, **default None*) – Name of the file. If no name is provided, a randomly named file will be written locally.


    * **open_browser** (*bool**, **default False*) – Whether a browser window will open or not after write


    * **notebook_display** (*bool**, **default True*) – Attempts to display the HTML output in an iframe if True. Only works in a Jupyter environment.


    * **iframe_width** (*int**, **default 700*) – Height of Jupyter notebook iframe in pixels, if rendered in a Jupyter environment.


    * **iframe_height** (*int**, **default 500*) – Width of Jupyter notebook iframe in pixels, if rendered in a Jupyter environment.



* **Returns**

    Returns absolute path of the file



* **Return type**

    str



#### update()
Update a deck.gl map to reflect the current configuration

For example, if you’ve modified data passed to Layer and rendered the map using .show(),
you can call update to change the data on the map.

Intended for use in a Jupyter environment.
