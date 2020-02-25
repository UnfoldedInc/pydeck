# LightSettings

Light settings are experimental in the pydeck beta.


### class pydeck.bindings.light_settings.LightSettings(number_of_lights=2, lights_position=None, diffuse_ratio=None, specular_ratio=None, lights_strength=None, ambient_ratio=None)
Bases: `pydeck.bindings.json_tools.JSONMixin`

Configuration of lights on the plane


* **Parameters**

    
    * **lights_position** (*array**, **default None*) – Location of lights in an array of X/Y/Z coordinates


    * **diffuse_ratio** (*float**, **default None*) – Proportion of light at many angles


    * **specular_ratio** (*float**, **default None*) – Proportion of light reflected in a mirror-like manner


    * **lights_strength** (*array**, **default None*) – Brightness of lights


    * **number_of_lights** (*int**, **default None*) – Number of lights in visualization
