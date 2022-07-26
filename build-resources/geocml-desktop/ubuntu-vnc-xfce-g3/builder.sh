#!/bin/bash
### @accetto, August 2021

main() {

    local blend=${1?Need blend}
    local cmd=${2?Need command}
    shift 2

    local log="scrap_buildersh.log"

    case "${cmd}" in

        pre_build | build | push | post_push )

            ./docker/hooks/"${cmd}" dev "${blend}" $@
            ;;

        all )

            ./docker/hooks/pre_build dev "${blend}" $@ > "${log}"

            echo "Excerpt from the pre_build log..."
            echo
            grep -A100 'Current verbose version sticker:' "${log}"

            if [[ $? -eq 0 ]] ; then

                if grep -Po 'new image should be built|Building of new image has been forced' "${log}" ; then

                    for c in "build" "push" "post_push" ; do

                        echo
                        echo "==> ${c} '${blend}'"
                        echo

                        ### note that the rest-parameters are not included here
                        ./docker/hooks/"${c}" dev "${blend}"

                        if [[ $? -ne 0 ]] ; then exit ; fi
                    done

                    echo
                    echo "==> Published '${blend}'"
                    echo
                else
                    echo
                    echo "==> No build needed for '${blend}'"
                    echo
                fi

                rm -f "${log}"
            fi
            ;;

        *)
            echo "Unknown command: ${cmd}"
            ;;
    esac
}

main $@
