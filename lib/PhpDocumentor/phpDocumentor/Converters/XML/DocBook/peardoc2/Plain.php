<?PHP
/* vim: set expandtab tabstop=4 shiftwidth=4: */

/**
 * XML/Beautifier/Renderer/Plain.php
 *
 * phpDocumentor :: automatic documentation generator
 *
 * PHP versions 4 and 5
 *
 * LICENSE:
 *
 * This library is free software; you can redistribute it
 * and/or modify it under the terms of the GNU Lesser General
 * Public License as published by the Free Software Foundation;
 * either version 2.1 of the License, or (at your option) any
 * later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
 *
 * @package  XML_Beautifier
 * @author   Stephan Schmidt <schst@php.net>
 * @license  http://www.opensource.org/licenses/lgpl-license.php LGPL
 */

/**
 * XML_Util is needed to create the tags
 */
require_once 'XML/Util.php';

/**
 * Renderer base class
 */
require_once 'XML/Beautifier/Renderer.php';

/**
 * Basic XML Renderer for XML Beautifier
 *
 * @package  XML_Beautifier
 * @author   Stephan Schmidt <schst@php.net>
 * @todo     option to specify inline tags
 * @todo     option to specify treatment of whitespac in data sections
 * @todo     automatically create <![CDATA[ ]]> sections
 */
class PHPDoc_XML_Beautifier_Renderer_Plain extends XML_Beautifier_Renderer {

   /**
    * Serialize the XML tokens
    *
    * @access   public
    * @param    array   XML tokens
    * @return   string  XML document
    */
    function serialize($tokens)
    {
        $tokens = $this->normalize($tokens);

        $xml    = '';
        $cnt    = count($tokens);
        for($i = 0; $i < $cnt; $i++ )
        {
            $xml .= $this->_serializeToken($tokens[$i]);
        }
        return $xml;
    }

    /**
     * serialize a token
     *
     * This method does the actual beautifying.
     *
     * @access  private
     * @param   array   $token structure that should be serialized
     * @todo    split this method into smaller methods
     */
    function _serializeToken($token)
    {
        switch ($token["type"]) {

            /*
            * serialize XML Element
            */
            case    XML_BEAUTIFIER_ELEMENT:
                $indent = $this->_getIndentString($token["depth"]);

                // adjust tag case
                if ($this->_options["caseFolding"] === true) {
                    switch ($this->_options["caseFoldingTo"]) {
                        case "uppercase":
                            $token["tagname"] = strtoupper($token["tagname"]);
                            $token["attribs"] = array_change_key_case($token["attribs"], CASE_UPPER);
                            break;
                        case "lowercase":
                            $token["tagname"] = strtolower($token["tagname"]);
                            $token["attribs"] = array_change_key_case($token["attribs"], CASE_LOWER);
                            break;
                    }
                }

                if ($this->_options["multilineTags"] == true) {
                    $attIndent = $indent . str_repeat(" ", (2+strlen($token["tagname"])));
                } else {
                    $attIndent = null;
                }
                // check for children
                switch ($token["contains"]) {

                    // contains only CData or is empty
                    case    XML_BEAUTIFIER_CDATA:
                    case    XML_BEAUTIFIER_EMPTY:
                        if (sizeof($token["children"]) >= 1) {
                        $data = $token["children"][0]["data"];
                        } else {
                            $data = '';
                        }

                        if( strstr( $data, "\n" ) && $token['contains'] != PHPDOC_BEAUTIFIER_CDATA)
                        {
                            $data   =   "\n" . $this->_indentTextBlock( $data, $token['depth']+1, true );
                        }

                        $xml  = $indent . XML_Util::createTag($token["tagname"], $token["attribs"], $data, null, false, $this->_options["multilineTags"], $attIndent)
                              . $this->_options["linebreak"];
                        break;
                    // contains mixed content
                    default:
                        $xml = $indent . XML_Util::createStartElement($token["tagname"], $token["attribs"], null, $this->_options["multilineTags"], $attIndent)
                             . $this->_options["linebreak"];

                        $cnt = count($token["children"]);
                        for ($i = 0; $i < $cnt; $i++) {
                            $xml .= $this->_serializeToken($token["children"][$i]);
                        }
                        $xml .= $indent . XML_Util::createEndElement($token["tagname"])
                             . $this->_options["linebreak"];
                        break;
                    break;
                }
                break;

            /*
            * serialize <![CDATA
            */
            case PHPDOC_BEAUTIFIER_CDATA:
                $xml = $token['data'] . $this->_options['linebreak'];
                break;

            /*
            * serialize CData
            */
            case    XML_BEAUTIFIER_CDATA:
                if ($token["depth"] > 0) {
                    $xml = str_repeat($this->_options["indent"], $token["depth"]);
                } else {
                    $xml = "";
                }

                $xml .= $token["data"] . $this->_options["linebreak"];
                break;

            /*
            * serialize Processing instruction
            */
            case    XML_BEAUTIFIER_PI:
                $indent = $this->_getIndentString($token["depth"]);

                $xml  = $indent."<?".$token["target"].$this->_options["linebreak"]
                      . $this->_indentTextBlock(rtrim($token["data"]), $token["depth"])
                      . $indent."?>".$this->_options["linebreak"];
                break;

            /*
            * comments
            */
            case    XML_BEAUTIFIER_COMMENT:
                $lines   = count(explode("\n",$token["data"]));

                /*
                * normalize comment, i.e. combine it to one
                * line and remove whitespace
                */
                if ($this->_options["normalizeComments"] && $lines > 1){
                    $comment = preg_replace("/\s\s+/s", " ", str_replace( "\n" , " ", $token["data"]));
                    $lines   = 1;
                } else {
                    $comment = $token["data"];
                }

                /*
                * check for the maximum length of one line
                */
                if ($this->_options["maxCommentLine"] > 0) {
                    if ($lines > 1) {
                        $commentLines = explode("\n", $comment);
                    } else {
                        $commentLines = array($comment);
                    }

                    $comment = "";
                    for ($i = 0; $i < $lines; $i++) {
                        if (strlen($commentLines[$i]) <= $this->_options["maxCommentLine"]) {
                            $comment .= $commentLines[$i];
                            continue;
                        }
                        $comment .= wordwrap($commentLines[$i], $this->_options["maxCommentLine"] );
                        if ($i != ($lines-1)) {
                            $comment .= "\n";
                        }
                    }
                    $lines   = count(explode("\n",$comment));
                }

                $indent = $this->_getIndentString($token["depth"]);

                if ($lines > 1) {
                    $xml  = $indent . "<!--" . $this->_options["linebreak"]
                          . $this->_indentTextBlock($comment, $token["depth"]+1, true)
                          . $indent . "-->" . $this->_options["linebreak"];
                } else {
                    $xml = $indent . sprintf( "<!-- %s -->", trim($comment) ) . $this->_options["linebreak"];
                }
                break;

            /*
            * xml declaration
            */
            case    XML_BEAUTIFIER_XML_DECLARATION:
                $indent = $this->_getIndentString($token["depth"]);
                $xml    = $indent . XML_Util::getXMLDeclaration($token["version"], $token["encoding"], $token["standalone"]);
                break;

            /*
            * xml declaration
            */
            case    XML_BEAUTIFIER_DT_DECLARATION:
                $xml    = $token["data"];
                break;

            /*
            * all other elements
            */
            case    XML_BEAUTIFIER_DEFAULT:
            default:
                $xml    = XML_Util::replaceEntities( $token["data"] );
                break;
        }
        return $xml;
    }
}
?>