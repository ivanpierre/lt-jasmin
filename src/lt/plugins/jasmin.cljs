(ns lt.plugins.jasmin
  (:require [clojure.string :as string]
            [lt.object :as object]
            [lt.objs.eval :as eval]
            [lt.objs.editor :as ed]
            [lt.objs.files :as files]
            [lt.objs.clients :as clients]
            [lt.util.dom :refer [$ append]])
  (:require-macros [lt.macros :refer [behavior defui]]))

(object/object* ::jasmin-lang
                :tags #{}
                :behaviors []
                :triggers #{})

(def jasmin-lang (object/create ::jasmin-lang))
