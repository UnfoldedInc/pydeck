# Data utilities

These items are convenience functions for common data processing work done for pydeck maps.


### pydeck.data_utils.viewport_helpers.compute_view(points, view_proportion=1, view_type=<class 'pydeck.bindings.view_state.ViewState'>)
Automatically computes a zoom level for the points passed in.


* **Parameters**

    
    * **points** (*list of list of float** or **pandas.DataFrame*) – A list of points


    * **view_propotion** (*float**, **default 1*) – Proportion of the data that is meaningful to plot


    * **view_type** (class constructor for pydeck.ViewState, default `pydeck.bindings.view_state.ViewState`) – Class constructor for a viewport. In the current version of pydeck,
    users most likely do not have to modify this attribute.



* **Returns**

    Viewport fitted to the data



* **Return type**

    pydeck.Viewport


For example, suppose you have 100 points, most of which are centered
around London and ten of which are distributed a few 100 kilometers away
from it. If you set `view_proportion=0.9`, pydeck will attempt to fit
to the middle 90% of the data, aiming to exclude the points furthest
from the core of the visualization. Suppose your ten points
are in the Americas in this example–they would be excluded.


### pydeck.data_utils.color_scales.assign_random_colors(data_vector)
Produces lookup table keyed by each class of data, with value as an RGB array


* **Parameters**

    **data_vector** (*list*) – Vector of data classes to be categorized, passed from the data itself



* **Returns**

    Dictionary of random RGBA value per class, keyed on class



* **Return type**

    collections.OrderedDict


## Examples

Below is an illustration of `pydeck.data_utils.color_scales.assign_random_colors()`,
using a small data set of two classes (here, ‘Palace’ and ‘Clock Tower)
and three obervations (‘Big Ben’, ‘Kensington Palace’, and ‘Buckingham Palace’).
Our goal is to quickly color the data by category.

```python
>>> import pydeck
>>> import pandas
>>> data = pandas.DataFrame([
>>>     {
>>>         'site': 'Big Ben',
>>>         'attraction_type': 'Clock Tower',
>>>         'lat': 51.5006958,
>>>         'lng': -0.1266639
>>>     },
>>>     {
>>>         'site': 'Kensington Palace',
>>>         'attraction_type': 'Palace':
>>>         'lat': 51.5046188,
>>>         'lng': -0.1839472
>>>     },
>>>     {
>>>         'attraction_type': 'Palace',
>>>         'site': 'Buckingham Palace',
>>>         'lat': 51.501364,
>>>         'lng': -0.14189
>>>     }
>>> ])
>>> color_lookup = pydeck.data_utils.assign_random_colors(data['attraction_type'])
>>> # Assign a color based on attraction_type
>>> data['color'] = data.apply(lambda row: color_lookup.get(row['attraction_type']), axis=1)
>>> # Data now has an RGB color by attraction type:
[
  {
        'site': 'Big Ben',
        'attraction_type': 'Clock Tower',
        'lat': 51.5006958,
        'lng': -0.1266639,
        'color': [0, 10, 35]
    },
    {
        'site': 'Kensington Palace',
        'attraction_type': 'Palace':
        'lat': 51.5046188,
        'lng': -0.1839472,
        'color': [53, 243, 130]
    },
  {
        'attraction_type': 'Palace',
        'site': 'Buckingham Palace',
        'lat': 51.501364,
        'lng': -0.14189,
        'color': [53, 243, 130]
    }
]
```
