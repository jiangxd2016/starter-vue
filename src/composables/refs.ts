import { reactive } from 'vue'

/**
 * Initializes a reactive object with empty references and provides a function to assign values to those references.
 *
 * @template T - the type of the object
 * @returns {{ refs: T, toRef: (refName: keyof T) => (el: any) => void }} - an object containing the reactive references and the function to assign values to those references
 *
 * @example
 * <template>
  <input :ref="toRef('input')" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRefs } from '@common/utils/useRefs'

const { refs, toRef } = useRefs<{
  input: InstanceType<typeof HTMLInputElement>
}>()

onMounted(() => {
  refs.input.focus()
})
</script>

 */
export const useRefs = <T extends object>() => {
  const refs = reactive<T>({} as T)
  const toRef = (refName: keyof T) => (el: any) => ((refs as T)[refName as keyof T] = el)

  return {
    refs,
    toRef,
  }
}
