module ExtJS4
  module SassExtensions
    module Functions
      module ThemeImages
        def theme_image(theme, path, without_url = false)
          path = path.value
         
          images_path = File.join($image_path, "themes", "images", theme.value)
          real_path = File.join(images_path, path)
          
          if !without_url
            url = "url('#{real_path}')"
          else
            url = "#{real_path}"
          end
          
          Sass::Script::String.new(url)
        end
        
        def get_image_details(theme, path, i)
          theme = theme.value
          path = path.value
          
          dir = File.expand_path(File.dirname(__FILE__)).gsub('lib', '')
          details = File.join(dir, "images/#{theme}/images")
          
          result = nil
          
          file = File.new(details, "r")
          while (line = file.gets)
            if line.match path
              result = line
            end
          end
          
          if result && result.split('|')[i]
            result = result.split('|')[i]
            result = Sass::Script::Parser.new result, 0, 0
            result.parse
          else
            Sass::Script::Number.new(0)
          end
        end
        
        def image_height(theme, path)
          get_image_details(theme, path, 4)
        end
        
        def image_width(theme, path)
          get_image_details(theme, path, 3)
        end
        
        def image_background_color(theme, path)
          get_image_details(theme, path, 5)
        end
        
        def image_background_y(theme, path)
          i = get_image_details(theme, path, 2)
          i = i.to_s.to_i
          i = Sass::Script::Number.new(-i)
          
          i
        end
        
        def background_position(offset, height, multiplier)
          offset = -offset.value.abs
          height = -height.value.abs
          multiplier = -multiplier.value.abs
          
          y = offset - (height * multiplier)
          
          Sass::Script::Number.new(y, ["px"])
        end
      end
    end
  end
end

module Sass::Script::Functions
  include ExtJS4::SassExtensions::Functions::ThemeImages
end